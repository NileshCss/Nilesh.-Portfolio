import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(20),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = schema.parse(body);

    // Store in Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from("contact_messages").insert({ name, email, message });
      } catch (e) {
        console.warn("Failed to store message in Supabase:", e);
      }
    }

    // Lazily import Resend so missing API key doesn't crash at build time
    const { Resend } = await import("resend");
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — email not sent in dev mode");
      // In development without API key, just return success
      return NextResponse.json({ success: true, dev: true }, { status: 200 });
    }

    const resend = new Resend(apiKey);

    // CONTACT_EMAIL = where you want to receive messages.
    // Must be the email you verified/registered with at resend.com
    // when using the sandbox `onboarding@resend.dev` sender.
    const toEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL || "rajputnileshsingh25@gmail.com";

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <contact@nileshrajput.me>",
      to: toEmail,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border-radius: 12px; overflow: hidden;">
          <div style="padding: 32px; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);">
            <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: white;">New Portfolio Message</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.7); font-family: monospace;">nks.dev → Contact Form</p>
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
            </table>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 16px;">
              <p style="margin: 0 0 8px; color: #71717a; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">MESSAGE</p>
              <p style="margin: 0; font-size: 14px; color: #d4d4d8; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API returned an error:", error);
      return NextResponse.json({ error: "Failed to send email", details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
