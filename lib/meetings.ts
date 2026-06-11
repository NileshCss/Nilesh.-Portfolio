import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export interface BookingRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  booking_date?: string;
  booking_time?: string;
  meet_link?: string;
  approval_source?: string;
  confirmed_at?: string;
  is_read: boolean;
}

export function generateMeetLink() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const id = `${part1}-${part2}-${part3}`;
  return {
    link: `meet.google.com/${id}`,
    id: id
  };
}

export async function approveBooking(bookingId: string, source: "Dashboard" | "Email") {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not configured in environment variables.");
  }

  // Use Service Role client to bypass RLS and perform update
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  // 1. Fetch current booking details
  const { data: booking, error: fetchError } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return { success: false, error: "Booking request not found." };
  }

  // 2. Safety locks: Check if already approved
  if (booking.status === "Confirmed" || booking.meet_link) {
    return { 
      success: false, 
      error: "Already Confirmed", 
      booking: booking as BookingRecord 
    };
  }

  // 3. Generate Meet details
  const meet = generateMeetLink();
  const now = new Date();
  
  // Format approval timestamp: "Approved on Jun 11, 2026 at 3:00 PM"
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
  const approvalTimestamp = `Approved on ${dateStr} at ${timeStr}`;

  // 4. Update booking row
  const { data: updatedBooking, error: updateError } = await supabase
    .from("contact_messages")
    .update({
      status: "Confirmed",
      confirmed_at: approvalTimestamp,
      meet_link: meet.link,
      approval_source: source,
      is_read: true
    })
    .eq("id", bookingId)
    .select()
    .single();

  if (updateError || !updatedBooking) {
    return { success: false, error: "Failed to update database record." };
  }

  // 5. Send confirmation emails via Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured — skipping automated emails.");
    return { success: true, booking: updatedBooking as BookingRecord };
  }

  const resend = new Resend(apiKey);
  const guestName = updatedBooking.name || "there";
  const guestEmailAddress = updatedBooking.email;
  const selectedDate = updatedBooking.booking_date || "Unknown Date";
  const selectedTime = updatedBooking.booking_time || "Unknown Time";

  // 📧 EMAIL 2 – Guest Confirmation (Sent to the visitor)
  const guestEmailHtml = `
    <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f5f5;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
      <div style="padding:32px;background:linear-gradient(135deg,#10b981 0%,#059669 100%);">
        <h1 style="margin:0;font-size:22px;font-weight:800;color:white;">🎉 Your meeting is confirmed!</h1>
        <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">30-Minute Intro Call</p>
      </div>
      <div style="padding:32px;line-height:1.6;font-size:14px;color:#d4d4d8;">
        <p>Hi ${guestName},</p>
        <p>🎉 Your 30-minute intro video call is confirmed!</p>
        
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px;margin:24px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;width:100px;">DATE</td>
              <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">${selectedDate}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">TIME</td>
              <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">${selectedTime}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">DURATION</td>
              <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">30 Minutes</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">TIMEZONE</td>
              <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">Asia/Calcutta</td>
            </tr>
          </table>
        </div>

        <div style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:20px;margin-bottom:24px;">
          <h4 style="margin:0 0 12px;font-size:13px;color:#10b981;text-transform:uppercase;letter-spacing:0.05em;">🟢 Join via Google Meet:</h4>
          <p style="margin:0 0 6px;"><span style="color:#71717a;font-size:11px;font-family:monospace;display:inline-block;width:100px;">👉 Meeting Link:</span> <a href="https://${meet.link}" style="color:#10b981;font-weight:700;text-decoration:none;">https://${meet.link}</a></p>
          <p style="margin:0;"><span style="color:#71717a;font-size:11px;font-family:monospace;display:inline-block;width:100px;">📋 Meeting ID:</span> <strong style="color:white;font-family:monospace;">${meet.id}</strong></p>
        </div>
        
        <p style="margin-bottom:24px;">To reschedule or cancel, please reply to this email.</p>
        <p style="margin-bottom:4px;color:#a1a1aa;">See you soon! 👋</p>
        <p style="margin-top:20px;font-weight:600;color:#f5f5f5;">Warm regards,</p>
        <p style="margin:0;color:#f5f5f5;font-weight:600;">Nilesh Kumar Singh</p>
      </div>
    </div>
  `;

  // 📧 EMAIL 3 – Admin Follow-up (Sent to the owner)
  const adminEmailHtml = `
    <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f5f5;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
      <div style="padding:32px;background:linear-gradient(135deg,#7c3aed 0%,#6366f1 100%);">
        <h1 style="margin:0;font-size:22px;font-weight:800;color:white;">✅ Meeting Approved & Confirmed</h1>
        <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">Admin Confirmation Log</p>
      </div>
      <div style="padding:32px;line-height:1.6;font-size:14px;color:#d4d4d8;">
        <p>Hi Admin,</p>
        <p>You successfully approved the meeting.</p>
        
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px;margin:24px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;width:120px;">👤 SENDER NAME</td>
              <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">${guestName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">📅 DATE & TIME</td>
              <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">${selectedDate} at ${selectedTime}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">🔗 MEET LINK</td>
              <td style="padding:6px 0;font-size:14px;"><a href="https://${meet.link}" style="color:#6366f1;font-weight:600;">https://${meet.link}</a></td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">🕓 APPROVED ON</td>
              <td style="padding:6px 0;font-size:14px;color:#a1a1aa;">${approvalTimestamp}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">📌 APPROVED VIA</td>
              <td style="padding:6px 0;font-size:14px;color:#c084fc;font-weight:700;text-transform:uppercase;">${source}</td>
            </tr>
          </table>
        </div>
        <p style="margin:0;font-size:11px;color:#71717a;font-family:monospace;">— Your Booking System</p>
      </div>
    </div>
  `;

  const adminNotificationEmail =
    process.env.CONTACT_EMAIL ||
    process.env.ADMIN_EMAIL ||
    "rajputnileshsingh25@gmail.com";

  // Dispatch both emails in parallel
  await Promise.all([
    // Send to guest
    resend.emails.send({
      from: "Nilesh Kumar Singh <meetings@nileshrajput.me>",
      to: guestEmailAddress,
      subject: "Your Meeting is Confirmed – Join via Google Meet",
      html: guestEmailHtml
    }),
    // Send to admin
    resend.emails.send({
      from: "Portfolio Calendar <meetings@nileshrajput.me>",
      to: adminNotificationEmail,
      subject: `✅ You confirmed ${guestName}'s meeting`,
      html: adminEmailHtml
    })
  ]).catch(err => {
    console.error("Failed to send Resend emails on approval:", err);
  });

  return { success: true, booking: updatedBooking as BookingRecord };
}
