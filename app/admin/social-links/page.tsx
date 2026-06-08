"use client";
import { Share2, Code2, Link2, AtSign, Mail, Phone } from "lucide-react";

const socialPlatforms = [
  { name: "GitHub", icon: Code2, color: "#24292e", url: "https://github.com/nileshkumarsingh", enabled: true, clicks: 247 },
  { name: "LinkedIn", icon: Link2, color: "#0A66C2", url: "https://linkedin.com/in/nileshkumarsingh", enabled: true, clicks: 189 },
  { name: "X / Twitter", icon: AtSign, color: "#000000", url: "https://x.com/nileshksingh", enabled: true, clicks: 94 },
  { name: "Email", icon: Mail, color: "#EA4335", url: "mailto:rajputnileshsingh25@gmail.com", enabled: true, clicks: 312 },
  { name: "Phone", icon: Phone, color: "#10B981", url: "tel:+91", enabled: false, clicks: 0 },
];

export default function SocialLinksPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
            Social Links
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
            Manage your social media links. Changes reflect on the public portfolio instantly.
          </p>
        </div>
        <button
          className="rounded-lg transition-all"
          style={{ padding: "10px 18px", background: "var(--brand-primary)", color: "#fff", border: "none", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}
        >
          Save All Links
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {socialPlatforms.map(({ name, icon: Icon, color, url, enabled, clicks }) => (
          <div
            key={name}
            className="flex items-center gap-4 rounded-xl p-4 transition-all"
            style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}
          >
            {/* Icon */}
            <div className="flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, background: `${color}18`, border: `1px solid ${color}30`, flexShrink: 0 }}>
              <Icon size={20} style={{ color }} />
            </div>

            {/* Platform name */}
            <div style={{ width: 120, flexShrink: 0 }}>
              <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{name}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{clicks} clicks</p>
            </div>

            {/* URL input */}
            <input
              defaultValue={url}
              className="flex-1 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", fontFamily: "var(--font-mono,monospace)", fontSize: "0.8rem" }}
            />

            {/* Toggle */}
            <div
              className="rounded-full flex-shrink-0 cursor-pointer"
              style={{
                width: 44,
                height: 24,
                background: enabled ? "var(--brand-primary)" : "var(--bg-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: enabled ? "flex-end" : "flex-start",
                padding: "0 3px",
                transition: "all 0.2s",
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="rounded-full" style={{ width: 18, height: 18, background: "#fff" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
