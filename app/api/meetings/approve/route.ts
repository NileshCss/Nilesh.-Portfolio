import { approveBooking } from "@/lib/meetings";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("id");

    if (!bookingId) {
      return new Response(
        getErrorHtml("Missing Booking ID", "A valid booking ID is required to approve the meeting."),
        { headers: { "Content-Type": "text/html" }, status: 400 }
      );
    }

    const result = await approveBooking(bookingId, "Email");

    if (!result.success) {
      if (result.error === "Already Confirmed" && result.booking) {
        return new Response(
          getSuccessHtml(
            result.booking,
            "Already Confirmed",
            "This meeting has already been approved and confirmed."
          ),
          { headers: { "Content-Type": "text/html" } }
        );
      }
      return new Response(
        getErrorHtml("Approval Failed", result.error || "Failed to approve the meeting request."),
        { headers: { "Content-Type": "text/html" }, status: 400 }
      );
    }

    return new Response(
      getSuccessHtml(
        result.booking,
        "Meeting Approved!",
        "The meeting request has been successfully approved and confirmed. An email with the Google Meet details has been sent to the guest."
      ),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err: any) {
    console.error("Unhandled exception in meeting approval API:", err);
    return new Response(
      getErrorHtml("Unexpected Error", err.message || "An unexpected error occurred while processing the request."),
      { headers: { "Content-Type": "text/html" }, status: 500 }
    );
  }
}

function getSuccessHtml(booking: any, title: string, subtitle: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | Meeting Confirmed</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg: #030712;
          --card-bg: rgba(17, 24, 39, 0.7);
          --accent: #10b981;
          --accent-glow: rgba(16, 185, 129, 0.15);
          --text: #f3f4f6;
          --text-muted: #9ca3af;
          --border: rgba(255, 255, 255, 0.08);
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          background-color: var(--bg);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: var(--text);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
          position: relative;
        }
        /* Gradient Background Blobs */
        body::before, body::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(100px);
          z-index: -1;
          opacity: 0.25;
        }
        body::before {
          background: #10b981;
          top: 20%;
          left: 15%;
        }
        body::after {
          background: #6366f1;
          bottom: 20%;
          right: 15%;
        }
        .container {
          max-width: 520px;
          width: 100%;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          text-align: center;
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--accent-glow);
          border: 1px solid rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
          color: var(--accent);
          box-shadow: 0 0 24px var(--accent-glow);
        }
        h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #ffffff 0%, #d1d5db 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .details-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px 24px;
          margin-bottom: 32px;
          text-align: left;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-family: monospace;
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .detail-value {
          font-size: 13.5px;
          font-weight: 700;
          color: #f3f4f6;
          text-align: right;
        }
        .button {
          display: inline-block;
          width: 100%;
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .button:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h1>${title}</h1>
        <p class="subtitle">${subtitle}</p>
        
        <div class="details-card">
          <div class="detail-row">
            <span class="detail-label">Guest</span>
            <span class="detail-value">${booking.name || "Anonymous"}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value" style="font-family: monospace; font-size: 12px;">${booking.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date</span>
            <span class="detail-value">${booking.booking_date}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time</span>
            <span class="detail-value">${booking.booking_time}</span>
          </div>
          ${booking.meet_link ? `
          <div class="detail-row">
            <span class="detail-label">Meet Link</span>
            <span class="detail-value" style="color: #10b981; font-family: monospace;"><a href="https://${booking.meet_link}" target="_blank" style="color: #10b981; text-decoration: none;">https://${booking.meet_link}</a></span>
          </div>
          ` : ""}
        </div>

        <button onclick="window.close()" class="button">Close Window</button>
      </div>
    </body>
    </html>
  `;
}

function getErrorHtml(title: string, message: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Approval Error</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg: #030712;
          --card-bg: rgba(17, 24, 39, 0.7);
          --accent: #ef4444;
          --accent-glow: rgba(239, 68, 68, 0.15);
          --text: #f3f4f6;
          --text-muted: #9ca3af;
          --border: rgba(255, 255, 255, 0.08);
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          background-color: var(--bg);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: var(--text);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
          position: relative;
        }
        /* Gradient Background Blobs */
        body::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: #ef4444;
          filter: blur(100px);
          z-index: -1;
          opacity: 0.15;
          top: 30%;
          left: 35%;
        }
        .container {
          max-width: 480px;
          width: 100%;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          text-align: center;
          animation: scaleIn 0.4s ease-out forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--accent-glow);
          border: 1px solid rgba(239, 68, 68, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
          color: var(--accent);
          box-shadow: 0 0 24px var(--accent-glow);
        }
        h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          color: #ffffff;
        }
        .message {
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .button {
          display: inline-block;
          width: 100%;
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .button:hover {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        </div>
        <h1>${title}</h1>
        <p class="message">${message}</p>
        
        <button onclick="window.close()" class="button">Close Window</button>
      </div>
    </body>
    </html>
  `;
}
