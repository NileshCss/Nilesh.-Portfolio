"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { Mail, Clock, Trash2, CheckCheck, MailOpen, Search, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const supabase = createClient();

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    fetchMessages();
  };

  const markAllRead = async () => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("is_read", false);
    fetchMessages();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    await supabase.from("contact_messages").delete().eq("id", deleteModal);
    if (selected?.id === deleteModal) setSelected(null);
    setDeleting(false);
    setDeleteModal(null);
    fetchMessages();
  };

  const selectMessage = (msg: Message) => {
    setSelected(msg);
    if (!msg.is_read) markRead(msg.id);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelative = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const filtered = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !msg.is_read) ||
      (filter === "read" && msg.is_read);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white/90">Messages</h2>
          <p className="text-sm text-slate-500">
            {messages.length} total · {unreadCount} unread
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <div className="flex rounded-xl border border-white/[0.08] overflow-hidden">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                filter === f
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-slate-500 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Messages layout */}
      <div className="grid lg:grid-cols-5 gap-4 min-h-[500px]">
        {/* Message list */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="divide-y divide-white/[0.04] max-h-[600px] overflow-y-auto">
            {filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => selectMessage(msg)}
                className={cn(
                  "w-full text-left px-4 py-3.5 hover:bg-white/[0.03] transition-colors",
                  selected?.id === msg.id && "bg-blue-500/5 border-l-2 border-blue-500",
                  !msg.is_read && "bg-white/[0.01]"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                    <span className={cn("text-sm truncate max-w-[140px]", !msg.is_read ? "font-bold text-white/90" : "font-medium text-slate-300")}>{msg.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 flex items-center gap-1 flex-shrink-0">
                    <Clock size={10} /> {formatRelative(msg.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{msg.message}</p>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Inbox size={32} className="text-slate-600 mb-3" />
                <p className="text-sm text-slate-500">No messages found</p>
              </div>
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {selected ? (
            <div className="h-full flex flex-col">
              {/* Detail header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-base font-bold text-white/90">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    {selected.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Clock size={12} /> {formatDate(selected.created_at)}
                  </span>
                  <button
                    onClick={() => setDeleteModal(selected.id)}
                    className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Detail body */}
              <div className="flex-1 px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                  {selected.is_read ? (
                    <MailOpen size={14} className="text-slate-500" />
                  ) : (
                    <Mail size={14} className="text-blue-400" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {selected.is_read ? "Read" : "Unread"}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              {/* Reply action */}
              <div className="px-6 py-4 border-t border-white/[0.06]">
                <a
                  href={`mailto:${selected.email}?subject=Re: Portfolio Contact&body=%0A%0A----%0AOriginal message from ${selected.name}:%0A${encodeURIComponent(selected.message)}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200"
                >
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <Mail size={40} className="text-slate-700 mb-3" />
              <p className="text-sm text-slate-500">Select a message to read</p>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={handleDelete} title="Message" loading={deleting} />
    </div>
  );
}
