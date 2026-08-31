import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address").max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(20, "Message must be at least 20 characters").max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;
    const resolvedSubject = subject?.trim() || "Contact Form Message";

    // ── Store in Supabase ──────────────────────────────────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-side only

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase env vars missing — message not stored");
    } else {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Insert the contact message
      const { data: insertedMessage, error: msgError } = await supabase
        .from("contact_messages")
        .insert({
          name,
          email,
          subject: resolvedSubject,
          message,
          status: "Unread",
          is_read: false,
          type: "message",
        })
        .select("id")
        .single();

      if (msgError) {
        console.error("Failed to store contact message:", msgError.message);
        // Don't block email — still try to send it
      } else if (insertedMessage?.id) {
        // Create a linked notification for the admin bell
        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            type: "contact_message",
            title: "New contact message",
            body: `${name} sent you a new message.`,
            reference_id: insertedMessage.id,
            is_read: false,
          });

        if (notifError) {
          // Non-fatal: log but don't fail the request
          console.warn("Failed to create notification:", notifError.message);
        }
      }
    }

    // ── Send email via Resend ──────────────────────────────────────────────
    const { Resend } = await import("resend");
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — email not sent in dev mode");
      return NextResponse.json({ success: true, dev: true }, { status: 200 });
    }

    const resend = new Resend(apiKey);
    const toEmail =
      process.env.CONTACT_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "rajputnileshsingh25@gmail.com";

    const { error: emailError } = await resend.emails.send({
      from: "Portfolio Contact <contact@nileshrajput.me>",
      to: toEmail,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border-radius: 12px; overflow: hidden;">
          <div style="padding: 32px; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);">
            <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: white;">New Portfolio Message</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.7); font-family: monospace;">nileshrajput.me → Contact Form</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #71717a; font-size: 12px; font-family: monospace; width: 80px;">NAME</td>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; color: #f5f5f5;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #71717a; font-size: 12px; font-family: monospace;">EMAIL</td>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <a href="mailto:${email}" style="color: #6366f1; font-size: 14px;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #71717a; font-size: 12px; font-family: monospace;">SUBJECT</td>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; color: #f5f5f5;">${resolvedSubject}</td>
              </tr>
            </table>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 16px;">
              <p style="margin: 0 0 8px; color: #71717a; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">MESSAGE</p>
              <p style="margin: 0; font-size: 14px; color: #d4d4d8; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend API error:", emailError);
      // Message was already saved to DB — return success anyway
      return NextResponse.json(
        { success: true, warning: "Email delivery failed, but message was saved." },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again." },
      { status: 400 }
    );
  }
}
