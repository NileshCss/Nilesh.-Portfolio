"use client";
import { Mail, Eye, Reply, Archive, Trash2, Search } from "lucide-react";

const mockMessages = [
  { id: "1", name: "Aman Verma", email: "amanverma@gmail.com", subject: "Project Collaboration", preview: "Hi Nilesh, I came across your portfolio and...", date: "May 24, 2025", status: "Unread" },
  { id: "2", name: "Priya Sharma", email: "priya.s@outlook.com", subject: "Job Opportunity", preview: "We have an exciting role that matches your profile...", date: "May 22, 2025", status: "Read" },
  { id: "3", name: "Rahul Mehta", email: "rahul.m@gmail.com", subject: "Freelance Project", preview: "I need a full-stack developer for a 3-month project...", date: "May 20, 2025", status: "Replied" },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Unread: { bg: "rgba(59,130,246,0.1)", color: "var(--brand-primary)" },
  Read: { bg: "rgba(100,116,139,0.1)", color: "var(--text-muted)" },
  Replied: { bg: "rgba(16,185,129,0.1)", color: "var(--emerald)" },
};

export default function ContactMessagesPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
            Contact Messages
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
            12 messages · 3 unread
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg justify-center w-full sm:w-auto" style={{ padding: "10px 18px", background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
          Export CSV
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            placeholder="Search by name, email, or subject..."
            className="w-full rounded-lg outline-none"
            style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem" }}
          />
        </div>
        <select className="rounded-lg outline-none w-full sm:w-auto" style={{ padding: "10px 14px", background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem" }}>
          <option>All Status</option>
          <option>Unread</option>
          <option>Read</option>
          <option>Replied</option>
          <option>Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="rounded-xl overflow-hidden min-w-[800px]" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
          <div className="flex items-center gap-4 px-5 py-3" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--admin-border)" }}>
            <input type="checkbox" style={{ width: 16, height: 16 }} />
            <span style={{ flex: 2, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Sender</span>
            <span style={{ flex: 2, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Subject</span>
            <span style={{ flex: 1, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Date</span>
            <span style={{ width: 80, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</span>
            <span style={{ width: 100, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Actions</span>
          </div>

          {mockMessages.map((msg, i) => {
            const sc = statusColors[msg.status];
            return (
              <div
                key={msg.id}
                className="flex items-center gap-4 px-5 py-4 transition-colors cursor-pointer"
                style={{ borderBottom: i < mockMessages.length - 1 ? "1px solid var(--admin-border)" : "none" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--admin-hover)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <input type="checkbox" style={{ width: 16, height: 16 }} onClick={(e) => e.stopPropagation()} />
                <div style={{ flex: 2, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{msg.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{msg.email}</p>
                </div>
                <div style={{ flex: 2, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{msg.subject}</p>
                  <p className="truncate" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{msg.preview}</p>
                </div>
                <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--text-muted)" }}>{msg.date}</span>
                <span style={{ width: 80, borderRadius: 100, padding: "3px 10px", background: sc.bg, color: sc.color, fontWeight: 600, fontSize: "0.72rem" }}>{msg.status}</span>
                <div style={{ width: 100, display: "flex", gap: 4 }}>
                  {[{ Icon: Eye, title: "View" }, { Icon: Reply, title: "Reply" }, { Icon: Archive, title: "Archive" }, { Icon: Trash2, title: "Delete" }].map(({ Icon, title }) => (
                    <button
                      key={title}
                      title={title}
                      style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                    >
                      <Icon size={13} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
