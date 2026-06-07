"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  FolderKanban,
  Briefcase,
  Sparkles,
  MessageSquare,
  Trophy,
  ArrowRight,
  Clock,
  Mail,
} from "lucide-react";

interface DashboardStats {
  projects: number;
  experiences: number;
  skills: number;
  achievements: number;
  totalMessages: number;
  unreadMessages: number;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0, experiences: 0, skills: 0, achievements: 0,
    totalMessages: 0, unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboard = async () => {
      const [
        { count: projectCount },
        { count: expCount },
        { count: skillCount },
        { count: achieveCount },
        { count: totalMsg },
        { count: unreadMsg },
        { data: messages },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("experiences").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("achievements").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        projects: projectCount ?? 0,
        experiences: expCount ?? 0,
        skills: skillCount ?? 0,
        achievements: achieveCount ?? 0,
        totalMessages: totalMsg ?? 0,
        unreadMessages: unreadMsg ?? 0,
      });
      setRecentMessages(messages ?? []);
      setLoading(false);
    };
    fetchDashboard();
  }, [supabase]);

  const quickActions = [
    { label: "Add Project", href: "/admin/projects", icon: FolderKanban },
    { label: "Add Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Manage Skills", href: "/admin/skills", icon: Sparkles },
    { label: "View Messages", href: "/admin/messages", icon: MessageSquare },
  ];

  const formatDate = (date: string) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white/90">
          Welcome back<span className="text-blue-400">.</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s an overview of your portfolio content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Projects" value={stats.projects} icon={FolderKanban} />
        <StatsCard label="Experience" value={stats.experiences} icon={Briefcase} />
        <StatsCard label="Skills" value={stats.skills} icon={Sparkles} />
        <StatsCard label="Achievements" value={stats.achievements} icon={Trophy} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-400" />
              <h3 className="text-sm font-bold text-white/90">Recent Messages</h3>
              {stats.unreadMessages > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold">
                  {stats.unreadMessages} new
                </span>
              )}
            </div>
            <Link
              href="/admin/messages"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Mail size={32} className="mx-auto text-slate-600 mb-3" />
              <p className="text-sm text-slate-500">No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!msg.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-white/85 truncate">{msg.name}</span>
                        <span className="text-xs text-slate-600">{msg.email}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-600 flex-shrink-0 flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white/90">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:border-blue-500/30 transition-colors">
                    <Icon size={16} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
                  <ArrowRight size={14} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
                </Link>
              );
            })}
          </div>

          {/* Portfolio link */}
          <div className="px-4 pb-4">
            <Link
              href="/"
              target="_blank"
              className="block text-center px-4 py-2.5 rounded-xl border border-white/[0.06] text-xs font-semibold text-slate-400 hover:text-white hover:border-white/[0.12] transition-all duration-200"
            >
              View Live Portfolio ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
