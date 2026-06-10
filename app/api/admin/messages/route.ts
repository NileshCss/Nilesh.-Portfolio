import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — send meeting approval confirmation email
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { email, name, date, time } = body;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const emailHtml = `
      <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f5f5;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <div style="padding:32px;background:linear-gradient(135deg,#10b981 0%,#059669 100%);">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:white;">🎉 Your meeting has been confirmed!</h1>
          <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">30-Minute Intro Call</p>
        </div>
        <div style="padding:32px;line-height:1.6;font-size:14px;color:#d4d4d8;">
          <p>Hi ${name},</p>
          <p>Your meeting has been confirmed! Here are your booking details:</p>
          
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px;margin:24px 0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;width:100px;">DATE</td>
                <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">${date}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">TIME</td>
                <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">${time}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">DURATION</td>
                <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">30 Minutes</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">TYPE</td>
                <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">Video Call (Intro Call)</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#71717a;font-size:12px;font-family:monospace;">TIMEZONE</td>
                <td style="padding:6px 0;font-size:14px;color:#f5f5f5;font-weight:600;">Asia/Calcutta</td>
              </tr>
            </table>
          </div>
          
          <p style="margin-bottom:16px;">A video call link will be shared with you shortly before the meeting.</p>
          <p style="margin-bottom:24px;">If you need to reschedule or cancel, please reply to this email.</p>
          
          <p style="margin-bottom:4px;color:#a1a1aa;">Looking forward to connecting with you! 🙌</p>
          <p style="margin-top:20px;font-weight:600;color:#f5f5f5;">Warm regards,</p>
          <p style="margin:0;color:#f5f5f5;font-weight:600;">Nilesh Kumar Singh</p>
          <p style="margin:0;font-size:12px;color:#71717a;">nileshkumarsingh.dev</p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "Nilesh Kumar Singh <meetings@nileshrajput.me>",
      to: email,
      subject: `Your Meeting is Confirmed – 30 Minute Intro Call with Nilesh Kumar Singh`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API returned an error:", error);
      return NextResponse.json({ error: error.message || "Failed to send confirmation email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Confirmation email failed:", err);
    return NextResponse.json({ error: err.message || "Failed to send confirmation" }, { status: 500 });
  }
}

// PATCH — mark read / mark all read
export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, markAllRead } = body;

    if (markAllRead) {
      await supabase.from("contact_messages").update({ is_read: true }).eq("is_read", false);
    } else if (id) {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
