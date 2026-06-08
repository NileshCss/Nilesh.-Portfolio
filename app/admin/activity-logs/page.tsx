"use client";
import { Clock, LogIn, FolderKanban, FileText, Image, Settings, CheckCircle, XCircle } from "lucide-react";

const activityLogs = [
  { id: "1", action: "Login Successful", description: "Admin logged in from Chrome on Windows", ip: "103.xx.xx.xx", device: "Chrome on Windows", status: "success", time: "2 min ago", icon: LogIn, color: "#10B981" },
  { id: "2", action: "Project Published", description: "MokshaSphere was published", ip: "103.xx.xx.xx", device: "Chrome on Windows", status: "success", time: "2 days ago", icon: FolderKanban, color: "#3B82F6" },
  { id: "3", action: "Resume Updated", description: "New resume uploaded: Nilesh_Kumar_Singh_Resume.pdf", ip: "103.xx.xx.xx", device: "Chrome on Windows", status: "success", time: "4 days ago", icon: FileText, color: "#F59E0B" },
  { id: "4", action: "Media Uploaded", description: "village-connect.jpg uploaded to media library", ip: "103.xx.xx.xx", device: "Chrome on Windows", status: "success", time: "1 week ago", icon: Image, color: "#8B5CF6" },
  { id: "5", action: "Settings Updated", description: "Portfolio availability status changed to Open to Work", ip: "103.xx.xx.xx", device: "Chrome on Windows", status: "success", time: "2 weeks ago", icon: Settings, color: "#64748B" },
];

export default function ActivityLogsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100 }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>Activity Logs</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>Track all admin actions and system events.</p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <select style={{ padding: "10px 14px", background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", borderRadius: 8, color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem", outline: "none" }}>
          <option>All Actions</option>
          <option>Login</option>
          <option>Project</option>
          <option>Resume</option>
          <option>Media</option>
          <option>Settings</option>
        </select>
        <select style={{ padding: "10px 14px", background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", borderRadius: 8, color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem", outline: "none" }}>
          <option>All Status</option>
          <option>Success</option>
          <option>Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
        <div className="flex items-center gap-4 px-5 py-3" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--admin-border)" }}>
          {["Action", "Description", "IP", "Device", "Time", "Status"].map((h, i) => (
            <span key={h} style={{ flex: i === 1 ? 2 : 1, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
          ))}
        </div>

        {activityLogs.map((log, i) => {
          const Icon = log.icon;
          return (
            <div
              key={log.id}
              className="flex items-center gap-4 px-5 py-4 transition-colors"
              style={{ borderBottom: i < activityLogs.length - 1 ? "1px solid var(--admin-border)" : "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--admin-hover)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: `${log.color}18`, flexShrink: 0 }}>
                  <Icon size={15} style={{ color: log.color }} />
                </div>
                <span style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{log.action}</span>
              </div>
              <span style={{ flex: 2, fontSize: "0.8rem", color: "var(--text-muted)" }}>{log.description}</span>
              <span style={{ flex: 1, fontFamily: "var(--font-mono,monospace)", fontSize: "0.75rem", color: "var(--text-muted)" }}>{log.ip}</span>
              <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--text-muted)" }}>{log.device}</span>
              <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--text-muted)" }}>{log.time}</span>
              <div style={{ flex: 1 }}>
                {log.status === "success" ? (
                  <span className="flex items-center gap-1.5" style={{ borderRadius: 100, padding: "3px 10px", background: "rgba(16,185,129,0.1)", color: "var(--emerald)", fontWeight: 600, fontSize: "0.72rem", width: "fit-content" }}>
                    <CheckCircle size={10} /> Success
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5" style={{ borderRadius: 100, padding: "3px 10px", background: "rgba(239,68,68,0.1)", color: "var(--red)", fontWeight: 600, fontSize: "0.72rem", width: "fit-content" }}>
                    <XCircle size={10} /> Failed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Showing 1-20 of 48 events</p>
        <div className="flex items-center gap-2">
          {["← Prev", "1", "2", "3", "Next →"].map((p) => (
            <button key={p} style={{ padding: "6px 12px", borderRadius: 6, background: p === "1" ? "var(--brand-primary)" : "var(--admin-card-bg)", color: p === "1" ? "#fff" : "var(--text-muted)", border: "1px solid var(--admin-border)", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 500, fontSize: "0.875rem", cursor: "pointer" }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
