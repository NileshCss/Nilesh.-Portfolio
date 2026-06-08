"use client";
import { LogIn, FolderKanban, FileText, Image, Settings, CheckCircle, XCircle } from "lucide-react";

const activityLogs = [
  { id: "1", action: "Login Successful", description: "Admin logged in from Chrome on Windows", ip: "103.xx.xx.xx", device: "Chrome / Windows", status: "success", time: "2 min ago", icon: LogIn, color: "#10B981" },
  { id: "2", action: "Project Published", description: "MokshaSphere was published", ip: "103.xx.xx.xx", device: "Chrome / Windows", status: "success", time: "2 days ago", icon: FolderKanban, color: "#3B82F6" },
  { id: "3", action: "Resume Updated", description: "New resume uploaded: Nilesh_Kumar_Singh_Resume.pdf", ip: "103.xx.xx.xx", device: "Chrome / Windows", status: "success", time: "4 days ago", icon: FileText, color: "#F59E0B" },
  { id: "4", action: "Media Uploaded", description: "village-connect.jpg uploaded to media library", ip: "103.xx.xx.xx", device: "Chrome / Windows", status: "success", time: "1 week ago", icon: Image, color: "#8B5CF6" },
  { id: "5", action: "Settings Updated", description: "Portfolio availability status changed to Open to Work", ip: "103.xx.xx.xx", device: "Chrome / Windows", status: "success", time: "2 weeks ago", icon: Settings, color: "#64748B" },
];

function StatusBadge({ status }: { status: string }) {
  const isSuccess = status === "success";
  return (
    <span
      className="inline-flex items-center gap-1"
      style={{
        borderRadius: 100,
        padding: "3px 10px",
        background: isSuccess ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
        color: isSuccess ? "var(--emerald, #10B981)" : "var(--red, #EF4444)",
        fontFamily: "var(--font-outfit,sans-serif)",
        fontWeight: 600,
        fontSize: "0.72rem",
        whiteSpace: "nowrap",
      }}
    >
      {isSuccess ? <CheckCircle size={10} /> : <XCircle size={10} />}
      {isSuccess ? "Success" : "Failed"}
    </span>
  );
}

export default function ActivityLogsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
          Activity Logs
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
          Track all admin actions and system events.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          style={{
            flex: "1 1 140px",
            padding: "10px 14px",
            background: "var(--admin-card-bg)",
            border: "1px solid var(--admin-border)",
            borderRadius: 8,
            color: "var(--text-primary)",
            fontFamily: "var(--font-outfit,sans-serif)",
            fontSize: "0.875rem",
            outline: "none",
            maxWidth: 200,
          }}
        >
          <option>All Actions</option>
          <option>Login</option>
          <option>Project</option>
          <option>Resume</option>
          <option>Media</option>
          <option>Settings</option>
        </select>
        <select
          style={{
            flex: "1 1 140px",
            padding: "10px 14px",
            background: "var(--admin-card-bg)",
            border: "1px solid var(--admin-border)",
            borderRadius: 8,
            color: "var(--text-primary)",
            fontFamily: "var(--font-outfit,sans-serif)",
            fontSize: "0.875rem",
            outline: "none",
            maxWidth: 200,
          }}
        >
          <option>All Status</option>
          <option>Success</option>
          <option>Failed</option>
        </select>
      </div>

      {/* ── Desktop Table (md+) ── */}
      <div className="hidden md:block rounded-xl overflow-hidden" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
        {/* Table header */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "2fr 3fr 1.5fr 1.8fr 1fr 1fr",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--admin-border)",
            padding: "10px 20px",
          }}
        >
          {["Action", "Description", "IP Address", "Device", "Time", "Status"].map((h) => (
            <span
              key={h}
              style={{
                fontFamily: "var(--font-outfit,sans-serif)",
                fontWeight: 700,
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Table rows */}
        {activityLogs.map((log, i) => {
          const Icon = log.icon;
          return (
            <div
              key={log.id}
              className="grid items-center transition-colors"
              style={{
                gridTemplateColumns: "2fr 3fr 1.5fr 1.8fr 1fr 1fr",
                padding: "14px 20px",
                borderBottom: i < activityLogs.length - 1 ? "1px solid var(--admin-border)" : "none",
                cursor: "default",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--admin-hover)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {/* Action */}
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 32, height: 32, background: `${log.color}18`, flexShrink: 0 }}
                >
                  <Icon size={15} style={{ color: log.color }} />
                </div>
                <span style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {log.action}
                </span>
              </div>

              {/* Description */}
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", paddingRight: 12 }}>
                {log.description}
              </span>

              {/* IP */}
              <span style={{ fontFamily: "var(--font-mono,monospace)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {log.ip}
              </span>

              {/* Device */}
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {log.device}
              </span>

              {/* Time */}
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                {log.time}
              </span>

              {/* Status */}
              <StatusBadge status={log.status} />
            </div>
          );
        })}
      </div>

      {/* ── Mobile Card List (< md) ── */}
      <div className="flex md:hidden flex-col gap-3">
        {activityLogs.map((log) => {
          const Icon = log.icon;
          return (
            <div
              key={log.id}
              className="rounded-xl"
              style={{
                background: "var(--admin-card-bg)",
                border: "1px solid var(--admin-border)",
                padding: "14px 16px",
              }}
            >
              {/* Top row: icon + action + status */}
              <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 36, height: 36, background: `${log.color}18`, flexShrink: 0 }}
                >
                  <Icon size={17} style={{ color: log.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    {log.action}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                    {log.time}
                  </p>
                </div>
                <StatusBadge status={log.status} />
              </div>

              {/* Description */}
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>
                {log.description}
              </p>

              {/* Footer: IP + Device */}
              <div
                className="flex flex-wrap gap-x-4 gap-y-1"
                style={{ paddingTop: 10, borderTop: "1px solid var(--admin-border)" }}
              >
                <span style={{ fontFamily: "var(--font-mono,monospace)", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  IP: {log.ip}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {log.device}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Showing 1–20 of 48 events</p>
        <div className="flex items-center gap-2">
          {["← Prev", "1", "2", "3", "Next →"].map((p) => (
            <button
              key={p}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: p === "1" ? "var(--brand-primary)" : "var(--admin-card-bg)",
                color: p === "1" ? "#fff" : "var(--text-muted)",
                border: "1px solid var(--admin-border)",
                fontFamily: "var(--font-outfit,sans-serif)",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
