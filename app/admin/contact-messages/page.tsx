"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Eye, Reply, Archive, Trash2, Search, RefreshCw, Download } from "lucide-react";
import { useToast } from "@/lib/hooks/useToast";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  is_read: boolean;
  created_at: string;
}

interface SelectedMessage extends Message {
  showReply?: boolean;
  replyText?: string;
}

const statusLabel = (msg: Message) => {
  if (!msg.is_read) return "Unread";
  return "Read";
};

const statusColors: Record<string, { bg: string; color: string }> = {
  Unread: { bg: "rgba(59,130,246,0.1)", color: "var(--brand-primary)" },
  Read: { bg: "rgba(100,116,139,0.1)", color: "var(--text-muted)" },
  Archived: { bg: "rgba(239,68,68,0.1)", color: "var(--red)" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return formatDate(dateStr);
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selected, setSelected] = useState<SelectedMessage | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load messages: " + error.message);
    } else {
      setMessages(data ?? []);
    }
    setLoading(false);
  }, [supabase, toast]);

  useEffect(() => {
    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel("contact-messages-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () =>
        fetchMessages()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchMessages, supabase]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);
    if (!error) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
      if (selected?.id === id) setSelected((s) => s ? { ...s, is_read: true } : s);
    }
  };

  const handleView = async (msg: Message) => {
    setSelected({ ...msg });
    if (!msg.is_read) await markAsRead(msg.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete: " + error.message);
    } else {
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
    setDeleteModal(null);
  };

  const handleReply = (msg: Message) => {
    const subject = msg.subject ? `Re: ${msg.subject}` : "Re: Your message";
    const body = `\n\n---\nOriginal message:\n${msg.message}`;
    window.location.href = `mailto:${msg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Subject", "Message", "Date", "Status"];
    const rows = filtered.map((m) => [
      m.name, m.email, m.subject ?? "", m.message, formatDate(m.created_at), statusLabel(m),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact_messages.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject ?? "").toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);

    const label = statusLabel(m);
    const matchStatus =
      statusFilter === "All Status" || label === statusFilter;

    return matchSearch && matchStatus;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
            Contact Messages
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
            {messages.length} messages · {unreadCount} unread
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 rounded-lg justify-center"
            style={{ padding: "10px 14px", background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-muted)", cursor: "pointer" }}
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg justify-center"
            style={{ padding: "10px 18px", background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or subject..."
            className="w-full rounded-lg outline-none"
            style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg outline-none w-full sm:w-auto"
          style={{ padding: "10px 14px", background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem" }}
        >
          <option>All Status</option>
          <option>Unread</option>
          <option>Read</option>
        </select>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex gap-5" style={{ minHeight: 400 }}>
          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <div className="rounded-xl overflow-hidden min-w-[700px]" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
              {/* Header row */}
              <div className="flex items-center gap-4 px-5 py-3" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--admin-border)" }}>
                <input type="checkbox" style={{ width: 16, height: 16 }} readOnly />
                <span style={{ flex: 2, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Sender</span>
                <span style={{ flex: 2, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</span>
                <span style={{ flex: 1, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Date</span>
                <span style={{ width: 72, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</span>
                <span style={{ width: 110, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Actions</span>
              </div>

              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <Mail size={32} style={{ margin: "0 auto 12px", color: "var(--text-muted)", opacity: 0.4 }} />
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No messages found</p>
                </div>
              ) : (
                filtered.map((msg, i) => {
                  const sc = statusColors[statusLabel(msg)] ?? statusColors.Read;
                  const isActive = selected?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleView(msg)}
                      className="flex items-center gap-4 px-5 py-4 transition-colors cursor-pointer"
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid var(--admin-border)" : "none",
                        background: isActive ? "var(--admin-hover)" : "transparent",
                        fontWeight: msg.is_read ? 400 : 600,
                      }}
                      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "var(--admin-hover)"; }}
                      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <input type="checkbox" style={{ width: 16, height: 16 }} onClick={(e) => e.stopPropagation()} readOnly />
                      <div style={{ flex: 2, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: msg.is_read ? 500 : 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>{msg.name}</p>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{msg.email}</p>
                      </div>
                      <div style={{ flex: 2, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: msg.is_read ? 500 : 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>{msg.subject ?? "No subject"}</p>
                        <p className="truncate" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{msg.message}</p>
                      </div>
                      <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--text-muted)" }}>{timeAgo(msg.created_at)}</span>
                      <span style={{ width: 72, borderRadius: 100, padding: "3px 8px", background: sc.bg, color: sc.color, fontWeight: 600, fontSize: "0.72rem", whiteSpace: "nowrap" }}>{statusLabel(msg)}</span>
                      <div style={{ width: 110, display: "flex", gap: 3 }} onClick={(e) => e.stopPropagation()}>
                        {[
                          { Icon: Eye, title: "View", action: () => handleView(msg) },
                          { Icon: Reply, title: "Reply", action: () => handleReply(msg) },
                          { Icon: Trash2, title: "Delete", action: () => setDeleteModal(msg.id) },
                        ].map(({ Icon, title, action }) => (
                          <button
                            key={title}
                            title={title}
                            onClick={action}
                            style={{ width: 30, height: 30, background: "transparent", border: "none", cursor: "pointer", color: title === "Delete" ? "var(--red)" : "var(--text-muted)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <Icon size={13} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Message detail panel */}
          {selected && (
            <div
              className="rounded-xl flex-shrink-0"
              style={{ width: 340, background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)" }}>{selected.name}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{selected.email}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.2rem", lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              {selected.subject && (
                <div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Subject</p>
                  <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>{selected.subject}</p>
                </div>
              )}

              <div>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Message</p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{selected.message}</p>
              </div>

              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(selected.created_at)}</p>

              <div className="flex flex-col gap-2" style={{ marginTop: "auto" }}>
                <button
                  onClick={() => handleReply(selected)}
                  className="flex items-center justify-center gap-2 rounded-lg"
                  style={{ padding: "10px 16px", background: "var(--brand-primary)", border: "none", color: "#fff", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}
                >
                  <Reply size={14} /> Reply via Email
                </button>
                <button
                  onClick={() => setDeleteModal(selected.id)}
                  className="flex items-center justify-center gap-2 rounded-lg"
                  style={{ padding: "10px 16px", background: "transparent", border: "1px solid var(--red)", color: "var(--red)", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setDeleteModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="rounded-2xl p-6 w-full max-w-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}>
              <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 8 }}>Delete Message</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: 20 }}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  style={{ flex: 1, padding: "10px", borderRadius: 8, background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", cursor: "pointer", fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  style={{ flex: 1, padding: "10px", borderRadius: 8, background: "var(--red)", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
