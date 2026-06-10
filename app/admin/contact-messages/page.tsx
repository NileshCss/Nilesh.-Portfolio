"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Eye, Reply, Trash2, Search, RefreshCw, Download, Check, X, CheckCircle } from "lucide-react";
import { useToast } from "@/lib/hooks/useToast";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  type?: 'message' | 'booking';
  status?: 'Unread' | 'Read' | 'Confirmed';
  confirmed_at?: string;
  booking_date?: string;
  booking_time?: string;
  is_read: boolean;
  created_at: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unread' | 'Read' | 'Confirmed'>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals state
  const [activeViewMessage, setActiveViewMessage] = useState<Message | null>(null);
  const [activeReplyMessage, setActiveReplyMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySuccess, setReplySuccess] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

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

    // Real-time subscription for changes
    const channel = supabase
      .channel("contact-messages-dashboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () =>
        fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, supabase]);

  // --- Mark as Read Action ---
  const markAsRead = async (id: string) => {
    const targetMsg = messages.find(m => m.id === id);
    if (!targetMsg) return;
    
    // Confirmed bookings maintain Confirmed status
    const dbStatus = (targetMsg.status || 'Unread');
    if (dbStatus === 'Confirmed') {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", id);
      if (!error) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
      }
      return;
    }

    const { error } = await supabase
      .from("contact_messages")
      .update({ 
        status: 'Read',
        is_read: true 
      })
      .eq("id", id);

    if (error) {
      console.warn("Failed to mark message as read in DB:", error.message);
    } else {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'Read', is_read: true } : m));
    }
  };

  // --- View Action ---
  const handleViewMessage = async (msg: Message) => {
    setActiveViewMessage(msg);
    if (!msg.is_read) {
      await markAsRead(msg.id);
    }
  };

  // --- Reply Action ---
  const handleReplyMessage = (msg: Message) => {
    setActiveReplyMessage(msg);
    setReplyText("");
    setReplySuccess(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeReplyMessage) return;

    // Simulate sending reply
    setReplySuccess(true);
    
    const subject = activeReplyMessage.subject ? `Re: ${activeReplyMessage.subject}` : "Re: Your message";
    const body = `${replyText}\n\n---\nOriginal message:\n${activeReplyMessage.message}`;
    
    setTimeout(() => {
      window.location.href = `mailto:${activeReplyMessage.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setActiveReplyMessage(null);
      setReplySuccess(false);
      toast.success("Opening mail client...");
    }, 1200);
  };

  // --- Approve / Confirm Booking Action ---
  const handleApproveBooking = async (msg: Message) => {
    setApprovingId(msg.id);
    const now = new Date();
    
    // Formatting date and time
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
    const confirmedAtStr = `${dateStr} at ${timeStr}`;

    // Update in Supabase
    const { error: dbError } = await supabase
      .from("contact_messages")
      .update({
        status: 'Confirmed',
        confirmed_at: confirmedAtStr,
        is_read: true
      })
      .eq("id", msg.id);

    if (dbError) {
      toast.error("Failed to approve booking: " + dbError.message);
      setApprovingId(null);
      return;
    }

    // Trigger API to send confirmation email
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: msg.email,
          name: msg.name,
          date: msg.booking_date || "Unknown Date",
          time: msg.booking_time || "Unknown Time"
        })
      });

      if (res.ok) {
        toast.success(`Confirmation email sent to ${msg.email}`);
      } else {
        const errData = await res.json();
        console.error("Failed to send approval email via API:", errData.error);
        toast.error("Booking confirmed but failed to send email: " + (errData.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Approval email dispatch crash:", err);
      toast.error("Confirmed, but failed to dispatch email client API");
    }

    // Refresh state locally
    setMessages(prev => prev.map(m => m.id === msg.id ? { 
      ...m, 
      status: 'Confirmed', 
      confirmed_at: confirmedAtStr, 
      is_read: true 
    } : m));
    
    if (activeViewMessage?.id === msg.id) {
      setActiveViewMessage(prev => prev ? { 
        ...prev, 
        status: 'Confirmed', 
        confirmed_at: confirmedAtStr, 
        is_read: true 
      } : null);
    }
    setApprovingId(null);
  };

  // --- Delete Action ---
  const handleDeleteMessage = async () => {
    if (!deleteTargetId) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", deleteTargetId);

    if (error) {
      toast.error("Failed to delete message: " + error.message);
    } else {
      toast.success("Message deleted successfully");
      setMessages(prev => prev.filter(m => m.id !== deleteTargetId));
      setSelectedIds(prev => prev.filter(id => id !== deleteTargetId));
      if (activeViewMessage?.id === deleteTargetId) {
        setActiveViewMessage(null);
      }
    }
    setDeleteTargetId(null);
  };

  // --- Bulk Delete Action ---
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .in("id", selectedIds);

    if (error) {
      toast.error("Failed to delete messages: " + error.message);
    } else {
      toast.success(`${selectedIds.length} messages deleted successfully`);
      setMessages(prev => prev.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
    }
    setBulkDeleteConfirm(false);
  };

  // --- Normalizer Helper for DB values ---
  const normalizeMessage = (msg: Message) => {
    const type = msg.type || 'message';
    const status = msg.status || (msg.is_read ? 'Read' : 'Unread');
    const subject = msg.subject || 'Contact Form Message';
    
    return {
      ...msg,
      type,
      status,
      subject
    };
  };

  // --- Computations ---
  const processedMessages = useMemo(() => {
    return messages.map(normalizeMessage);
  }, [messages]);

  const filteredMessages = useMemo(() => {
    return processedMessages.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q);
      
      const matchesFilter = 
        statusFilter === 'All' ? true :
        statusFilter === 'Unread' ? item.status === 'Unread' :
        statusFilter === 'Read' ? item.status === 'Read' :
        item.status === 'Confirmed';

      return matchesSearch && matchesFilter;
    });
  }, [processedMessages, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = processedMessages.length;
    const unread = processedMessages.filter(m => m.status === 'Unread').length;
    return { total, unread };
  }, [processedMessages]);

  // --- Message Selection Helpers ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredMessages.map(m => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // --- Export CSV ---
  const handleExportCSV = () => {
    const headers = ["SENDER NAME", "SENDER EMAIL", "SUBJECT", "MESSAGE PREVIEW", "DATE", "STATUS", "CONFIRMED AT"];
    const rows = filteredMessages.map(item => [
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.email.replace(/"/g, '""')}"`,
      `"${item.subject.replace(/"/g, '""')}"`,
      `"${item.message.substring(0, 100).replace(/"/g, '""')}..."`,
      formatDate(item.created_at),
      item.status,
      item.confirmed_at ? `"${item.confirmed_at}"` : ""
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `contact_messages_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-outfit, sans-serif)", fontWeight: 800 }}>
            Contact Messages
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {stats.total} messages · {stats.unread} unread
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchMessages}
            className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors flex items-center justify-center bg-white dark:bg-slate-900"
            title="Refresh Messages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleExportCSV}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-750 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters / Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="py-2.5 px-4 border border-slate-200 dark:border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Status</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
            <option value="Confirmed">Confirmed</option>
          </select>
          
          {selectedIds.length > 0 && (
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              className="py-2.5 px-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-650 dark:text-red-400 font-semibold text-sm rounded-xl transition-all border border-red-200 dark:border-red-800"
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        /* Messages Table Container */
        <div className="overflow-x-auto border border-slate-150 dark:border-slate-850 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredMessages.length > 0 && selectedIds.length === filteredMessages.length}
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-355 dark:border-slate-700 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  const isBooking = item.type === 'booking';
                  const isConfirmed = item.status === 'Confirmed';
                  
                  return (
                    <tr 
                      key={item.id}
                      onClick={() => handleViewMessage(item)}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${
                        item.status === 'Unread' ? 'bg-blue-50/10 dark:bg-blue-950/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(item.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 border-slate-355 dark:border-slate-700 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 select-all">{item.email}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs md:max-w-md">
                        <div className={`truncate text-slate-900 dark:text-slate-100 ${item.status === 'Unread' ? 'font-bold' : 'font-medium'}`}>
                          {item.subject}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{item.message}</div>
                        {isConfirmed && item.confirmed_at && (
                          <div className="text-[11px] text-emerald-650 dark:text-emerald-455 font-semibold flex items-center gap-1 mt-1">
                            <Check className="w-3.5 h-3.5" /> Confirmed on {item.confirmed_at}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isConfirmed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                            Confirmed
                          </span>
                        ) : item.status === 'Unread' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-55 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                            Unread
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            Read
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap text-xs font-bold space-x-1" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => handleViewMessage(item)}
                          className="px-2.5 py-1.5 text-blue-650 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        
                        <button 
                          onClick={() => handleReplyMessage(item)}
                          className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Reply className="w-3 h-3" /> Reply
                        </button>

                        {isBooking && (
                          isConfirmed ? (
                            <span className="px-2.5 py-1.5 text-slate-400 dark:text-slate-600 inline-flex items-center gap-1 cursor-not-allowed">
                              ✅ sent
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleApproveBooking(item)}
                              disabled={approvingId === item.id}
                              className="px-2.5 py-1.5 text-emerald-650 hover:bg-emerald-50 dark:text-emerald-450 dark:hover:bg-emerald-900/30 rounded-lg transition-colors inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20"
                            >
                              {approvingId === item.id ? "Sending..." : "✅ Confirm"}
                            </button>
                          )
                        )}

                        <button 
                          onClick={() => setDeleteTargetId(item.id)}
                          className="px-2.5 py-1.5 text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    <Mail className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS SECTION */}
      {/* ========================================================================= */}

      {/* 1. View Message Modal */}
      {activeViewMessage && (() => {
        const isBooking = activeViewMessage.type === 'booking';
        const isConfirmed = activeViewMessage.status === 'Confirmed';
        
        return (
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-lg w-full overflow-hidden animate-scale-up">
              <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  isBooking
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                }`}>
                  {isBooking ? '📅 Video Booking' : '✉ Message'}
                </span>
                <button 
                  onClick={() => setActiveViewMessage(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg font-bold p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">From</h3>
                  <p className="font-semibold text-slate-900 dark:text-white text-base">{activeViewMessage.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono select-all">{activeViewMessage.email}</p>
                </div>

                <div className="flex gap-6 border-y border-slate-100 dark:border-slate-800 py-3">
                  <div className="flex-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date Received</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-350 font-medium">{formatDate(activeViewMessage.created_at)}</p>
                  </div>
                  {isBooking && activeViewMessage.booking_time && (
                    <div className="flex-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Requested Booking Time</h3>
                      <p className="text-sm text-slate-700 dark:text-slate-350 font-medium">{activeViewMessage.booking_date} at {activeViewMessage.booking_time}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Subject</h3>
                  <p className="font-bold text-slate-900 dark:text-white text-base mt-0.5">{activeViewMessage.subject}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Message / Details</h3>
                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {activeViewMessage.message}
                  </div>
                  {isConfirmed && activeViewMessage.confirmed_at && (
                    <div className="text-[11px] text-emerald-650 dark:text-emerald-450 font-semibold flex items-center gap-1 mt-2.5 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/50 p-2.5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-55" /> Confirmed on {activeViewMessage.confirmed_at}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                {isBooking && (
                  isConfirmed ? (
                    <span className="px-3.5 py-2 text-slate-400 dark:text-slate-600 font-semibold text-sm inline-flex items-center gap-1 cursor-not-allowed">
                      ✅ Confirmed
                    </span>
                  ) : (
                    <button 
                      onClick={() => {
                        const target = activeViewMessage;
                        setActiveViewMessage(null);
                        handleApproveBooking(target);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-500/20"
                    >
                      Confirm Booking
                    </button>
                  )
                )}
                
                <button 
                  onClick={() => {
                    const replyTarget = activeViewMessage;
                    setActiveViewMessage(null);
                    handleReplyMessage(replyTarget);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  Reply
                </button>
                <button 
                  onClick={() => setActiveViewMessage(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-855 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold rounded-xl transition-all bg-white dark:bg-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. Reply Modal */}
      {activeReplyMessage && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={handleSendReply} className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-lg w-full overflow-hidden animate-scale-up">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">↩ Send Reply</h3>
              <button 
                type="button"
                onClick={() => setActiveReplyMessage(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg font-bold p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">To</label>
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-655 dark:text-slate-300 text-sm select-all font-mono">
                  {activeReplyMessage.name} &lt;{activeReplyMessage.email}&gt;
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Subject</label>
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-655 dark:text-slate-300 text-sm">
                  Re: {activeReplyMessage.subject}
                </div>
              </div>

              <div>
                <label htmlFor="replyText" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Your Message</label>
                <textarea
                  id="replyText"
                  rows={5}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response email here..."
                  required
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
              </div>

              {replySuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 text-xs px-4 py-2.5 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Generating mail link...
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button 
                type="submit"
                disabled={replySuccess}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                Send Reply
              </button>
              <button 
                type="button"
                onClick={() => setActiveReplyMessage(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-855 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold rounded-xl transition-all bg-white dark:bg-slate-900"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-150 dark:border-slate-800 max-w-sm w-full p-6 space-y-4 animate-scale-up">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Confirm Delete</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Are you sure you want to permanently delete this message? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={handleDeleteMessage}
                className="px-4 py-2 bg-red-655 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Delete
              </button>
              <button 
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-855 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold rounded-xl transition-all bg-white dark:bg-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bulk Delete Confirmation Modal */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-155 dark:border-slate-800 max-w-sm w-full p-6 space-y-4 animate-scale-up">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Bulk Delete</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Are you sure you want to permanently delete the <span className="font-bold text-slate-900 dark:text-white">{selectedIds.length}</span> selected messages?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-655 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Yes, Delete All
              </button>
              <button 
                onClick={() => setBulkDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-855 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold rounded-xl transition-all bg-white dark:bg-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
