import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  date: z.string(),       // ISO date string: "YYYY-MM-DD"
  time: z.string(),       // e.g. "10:00 AM"
  timezone: z.string(),   // e.g. "Asia/Kolkata"
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  type: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, time, timezone, name, email, type } = schema.parse(body);

    // Always log the booking — visible in Vercel/server logs even if email fails
    console.log("📅 MEETING BOOKING RECEIVED:", {
      date, time, timezone, name: name || "—", email: email || "—", type,
    });

    const apiKey = process.env.RESEND_API_KEY;
    
    // Store in Supabase contact_messages if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Parse the date for a nice display string
    const [year, month, day] = date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dateString = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const metadata = {
          type: "booking",
          subject: "30-Minute Intro Call",
          status: "Unread",
          bookingDate: dateString,
          bookingTime: time
        };
        const bodyText = `Scheduled meeting on ${dateString} at ${time}. Timezone: ${timezone}`;
        
        await supabase.from("contact_messages").insert({
          name: name || "Anonymous",
          email: email || "no-email@example.com",
          message: `__METADATA__:${JSON.stringify(metadata)}\n${bodyText}`,
          is_read: false
        });
      } catch (e) {
        console.warn("Failed to store meeting booking in Supabase:", e);
      }
    }

    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — email skipped, booking logged above");
      // Still return success so the user doesn't get an error
      return NextResponse.json({ success: true, dev: true }, { status: 200 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    // Date string and object are already defined above

    // CONTACT_EMAIL must be the email you registered with at resend.com
    // when using the onboarding@resend.dev sandbox sender.
    const toEmail =
      process.env.CONTACT_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "rajputnileshsingh25@gmail.com";

    const meetingLabel = type === "video_call_30min" ? "30-Minute Video Call" : "Meeting";

    // 1️⃣  Notify the portfolio owner
    const ownerHtml = `
      <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f5f5;border-radius:12px;overflow:hidden;">
        <div style="padding:32px;background:linear-gradient(135deg,#6366f1 0%,#7c3aed 100%);">
          <h1 style="margin:0;font-size:20px;font-weight:700;color:white;">📅 New Meeting Scheduled!</h1>
          <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.7);font-family:monospace;">Portfolio → Schedule a Video Call</p>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#71717a;font-size:12px;font-family:monospace;width:100px;">DATE</td>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:14px;color:#f5f5f5;">${dateString}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#71717a;font-size:12px;font-family:monospace;">TIME</td>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:14px;color:#f5f5f5;">${time}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#71717a;font-size:12px;font-family:monospace;">TIMEZONE</td>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:14px;color:#f5f5f5;font-family:monospace;">${timezone}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#71717a;font-size:12px;font-family:monospace;">TYPE</td>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:14px;color:#f5f5f5;">${meetingLabel}</td>
            </tr>
            ${name ? `<tr>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#71717a;font-size:12px;font-family:monospace;">NAME</td>
              <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:14px;color:#f5f5f5;">${name}</td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="padding:8px 0;color:#71717a;font-size:12px;font-family:monospace;">EMAIL</td>
              <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#6366f1;font-size:14px;">${email}</a></td>
            </tr>` : ""}
          </table>
          <p style="font-size:13px;color:#71717a;margin:0;">Send the meeting invite to the person who booked this slot.</p>
        </div>
      </div>
    `;

    // Best-effort email — if Resend fails, booking is still logged above
    const { error: ownerError } = await resend.emails.send({
      from: "Portfolio Calendar <onboarding@resend.dev>",
      to: toEmail,
      subject: `📅 Meeting Booked: ${meetingLabel} on ${dateString} at ${time}`,
      html: ownerHtml,
    });

    if (ownerError) {
      // Log the Resend error but DO NOT return 500 — the booking was already logged above
      console.error("Resend failed to send owner email:", ownerError);
      console.error("Check: CONTACT_EMAIL must match your Resend account email (resend.com dashboard)");
      // Still return success to the visitor — don't break their experience
      return NextResponse.json({ success: true, emailError: true }, { status: 200 });
    }

    // 2️⃣  Best-effort guest confirmation (sandbox only delivers to the Resend account email)
    if (email) {
      const guestHtml = `
        <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f5f5;border-radius:12px;overflow:hidden;">
          <div style="padding:32px;background:linear-gradient(135deg,#10b981 0%,#059669 100%);">
            <h1 style="margin:0;font-size:20px;font-weight:700;color:white;">✅ Meeting Confirmed!</h1>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">Your ${meetingLabel} with Nilesh Kumar Singh</p>
          </div>
          <div style="padding:32px;">
            <p style="font-size:15px;color:#d4d4d8;margin:0 0 24px;">Hi${name ? ` ${name}` : ""},</p>
            <p style="font-size:14px;color:#a1a1aa;line-height:1.6;margin:0 0 24px;">
              Your meeting has been confirmed. Here are the details:
            </p>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px;margin-bottom:24px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;width:100px;">DATE</td>
                  <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">${dateString}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">TIME</td>
                  <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">${time} (${timezone})</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">TYPE</td>
                  <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">${meetingLabel}</td>
                </tr>
              </table>
            </div>
            <p style="font-size:13px;color:#71717a;margin:0;">
              A calendar invite will follow. If you need to reschedule, reply to this email.
            </p>
          </div>
        </div>
      `;

      // Best-effort — sandbox sender can only deliver to the Resend account email
      await resend.emails.send({
        from: "Nilesh Kumar Singh <onboarding@resend.dev>",
        to: email,
        subject: `✅ Meeting Confirmed: ${meetingLabel} on ${dateString} at ${time}`,
        html: guestHtml,
      }).catch(e => console.warn("Guest confirmation skipped (sandbox restriction):", e));
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Meetings API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
