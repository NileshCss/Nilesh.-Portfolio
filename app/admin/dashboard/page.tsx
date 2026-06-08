"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Code2,
  BarChart2,
  Eye,
  Download,
  Mail,
  Pencil,
  Trash2,
  Plus,
  Upload,
  Briefcase,
  UserCog,
  CheckCircle2,
  FileText,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

/* ───────────── Types ───────────── */
interface DashboardStats {
  projects: number;
  visitors: number;
  profileViews: number;
  resumeDownloads: number;
  totalMessages: number;
  unreadMessages: number;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  is_read: boolean;
  created_at: string;
}

interface RecentProject {
  id: string;
  title: string;
  status: string;
  updated_at: string;
  live_url: string | null;
  category: string;
}

/* ───────────── Static mock data ───────────── */
const visitorData = [
  { day: "May 18", visitors: 450 },
  { day: "May 19", visitors: 600 },
  { day: "May 20", visitors: 580 },
  { day: "May 21", visitors: 650 },
  { day: "May 22", visitors: 750 },
  { day: "May 23", visitors: 900 },
  { day: "May 24", visitors: 1100 },
];

const projectColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
}

function projectStatus(status: string) {
  if (status === "live") return "Published";
  if (status === "development") return "Draft";
  return "Published"; // completed
}

/* ───────────── Sub-components ───────────── */

function StatsCard({
  label,
  value,
  change,
  changeLabel,
  changeColor,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  change: string;
  changeLabel: string;
  changeColor: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className="rounded-xl p-5 transition-all duration-200 cursor-default"
      style={{
        background: "var(--admin-card-bg)",
        border: "1px solid var(--admin-border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-primary)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 24px rgba(37,99,235,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--admin-border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between mb-3">
        <p
          style={{
            fontFamily: "var(--font-outfit, sans-serif)",
            fontWeight: 500,
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          {label}
        </p>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 40,
            height: 40,
            background: iconBg,
          }}
        >
          <Icon size={20} color={iconColor} />
        </div>
      </div>
      {/* Value */}
      <p
        style={{
          fontFamily: "var(--font-outfit, sans-serif)",
          fontWeight: 800,
          fontSize: "1.875rem",
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </p>
      {/* Change row */}
      <p
        style={{
          fontFamily: "var(--font-outfit, sans-serif)",
          fontWeight: 500,
          fontSize: "0.78rem",
          color: changeColor,
        }}
      >
        {change}{" "}
        <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
          {changeLabel}
        </span>
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    Published: {
      bg: "rgba(16,185,129,0.1)",
      color: "var(--emerald)",
      border: "rgba(16,185,129,0.2)",
    },
    Draft: {
      bg: "rgba(245,158,11,0.1)",
      color: "var(--amber)",
      border: "rgba(245,158,11,0.2)",
    },
    Archived: {
      bg: "rgba(100,116,139,0.1)",
      color: "var(--text-muted)",
      border: "rgba(100,116,139,0.2)",
    },
  };
  const c = colors[status] || colors.Draft;
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: 100,
        padding: "3px 10px",
        fontFamily: "var(--font-outfit, sans-serif)",
        fontWeight: 600,
        fontSize: "0.72rem",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function SectionCard({
  title,
  action,
  actionHref,
  children,
}: {
  title: string;
  action?: string;
  actionHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--admin-card-bg)",
        border: "1px solid var(--admin-border)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--admin-border)" }}
      >
        <h3
          style={{
            fontFamily: "var(--font-outfit, sans-serif)",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h3>
        {action && actionHref && (
          <Link
            href={actionHref}
            style={{
              fontFamily: "var(--font-outfit, sans-serif)",
              fontWeight: 500,
              fontSize: "0.8rem",
              color: "var(--brand-primary)",
              textDecoration: "none",
            }}
          >
            {action}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

/* ───────────── Custom chart tooltip ───────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-strong)",
          borderRadius: 8,
          padding: "8px 12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
      >
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 2 }}>
          {label}
        </p>
        <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--brand-primary)" }}>
          {payload[0].value.toLocaleString()} visitors
        </p>
      </div>
    );
  }
  return null;
};

/* ───────────── Main page ───────────── */
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    visitors: 5482,
    profileViews: 1248,
    resumeDownloads: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentProjectsList, setRecentProjectsList] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [
          { count: projectCount },
          { count: totalMsg },
          { count: unreadMsg },
          { data: messages },
          { data: projects },
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
          supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(3),
          supabase.from("projects").select("id,title,status,updated_at,live_url,category").order("updated_at", { ascending: false }).limit(5),
        ]);

        setStats((prev) => ({
          ...prev,
          projects: projectCount ?? prev.projects,
          totalMessages: totalMsg ?? prev.totalMessages,
          unreadMessages: unreadMsg ?? prev.unreadMessages,
        }));
        setRecentMessages(messages ?? []);
        setRecentProjectsList(projects ?? []);
      } catch {
        // Use fallback data on error
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div
          className="rounded-full animate-spin"
          style={{
            width: 32,
            height: 32,
            border: "2.5px solid var(--brand-pale)",
            borderTopColor: "var(--brand-primary)",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      {/* ── 5 Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          label="Total Projects"
          value={stats.projects}
          change="↑ 2"
          changeLabel="this month"
          changeColor="var(--emerald)"
          icon={Code2}
          iconBg="rgba(37,99,235,0.15)"
          iconColor="#3B82F6"
        />
        <StatsCard
          label="Total Visitors"
          value={stats.visitors.toLocaleString()}
          change="↑ 18.7%"
          changeLabel="this month"
          changeColor="var(--emerald)"
          icon={BarChart2}
          iconBg="rgba(16,185,129,0.15)"
          iconColor="#10B981"
        />
        <StatsCard
          label="Profile Views"
          value={stats.profileViews.toLocaleString()}
          change="↑ 12.4%"
          changeLabel="this month"
          changeColor="var(--emerald)"
          icon={Eye}
          iconBg="rgba(124,58,237,0.15)"
          iconColor="#7C3AED"
        />
        <StatsCard
          label="Resume Downloads"
          value={stats.resumeDownloads}
          change="↑ 8.3%"
          changeLabel="this month"
          changeColor="var(--emerald)"
          icon={Download}
          iconBg="rgba(245,158,11,0.15)"
          iconColor="#F59E0B"
        />
        <StatsCard
          label="Contact Messages"
          value={stats.totalMessages}
          change={`↑ ${stats.unreadMessages}`}
          changeLabel="new messages"
          changeColor="var(--brand-primary)"
          icon={Mail}
          iconBg="rgba(239,68,68,0.15)"
          iconColor="#EF4444"
        />
      </div>

      {/* ── Main 3-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_0.9fr] gap-5">

        {/* Col 1 — Recent Projects */}
        <SectionCard title="Recent Projects" action="View All" actionHref="/admin/projects">
          <div>
            {recentProjectsList.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Code2 size={28} style={{ margin: "0 auto 8px", color: "var(--text-muted)", opacity: 0.4 }} />
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No projects yet.</p>
                <Link href="/admin/projects" style={{ fontSize: "0.8rem", color: "var(--brand-primary)", textDecoration: "none" }}>Add your first project →</Link>
              </div>
            ) : (
              recentProjectsList.map((project, i) => {
                const color = projectColors[i % projectColors.length];
                return (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 px-5 py-3 transition-colors"
                    style={{
                      borderBottom: i < recentProjectsList.length - 1 ? "1px solid var(--admin-border)" : "none",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--admin-hover)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    {/* Thumbnail */}
                    <div
                      className="rounded-md flex-shrink-0"
                      style={{
                        width: 48,
                        height: 38,
                        background: `linear-gradient(135deg, ${color}30, ${color}15)`,
                        border: `1px solid ${color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Code2 size={16} color={color} />
                    </div>

                    {/* Name + updated */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        className="truncate"
                        style={{
                          fontFamily: "var(--font-outfit, sans-serif)",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {project.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-outfit, sans-serif)",
                          fontWeight: 400,
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Updated {timeAgo(project.updated_at)}
                      </p>
                    </div>

                    {/* Status badge */}
                    <StatusBadge status={projectStatus(project.status)} />

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        title="Edit"
                        onClick={() => router.push("/admin/projects")}
                        className="flex items-center justify-center rounded-md transition-all duration-150"
                        style={{ width: 28, height: 28, background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                      >
                        <Pencil size={14} />
                      </button>
                      {project.live_url ? (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Live"
                          className="flex items-center justify-center rounded-md transition-all duration-150"
                          style={{ width: 28, height: 28, background: "transparent", color: "var(--text-muted)", textDecoration: "none" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                        >
                          <Eye size={14} />
                        </a>
                      ) : (
                        <button disabled title="No live URL" style={{ width: 28, height: 28, background: "transparent", border: "none", color: "var(--text-muted)", cursor: "not-allowed", opacity: 0.4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SectionCard>

        {/* Col 2 — Visitors Overview chart */}
        <SectionCard title="Visitors Overview" action="View Analytics" actionHref="/admin/analytics">
          <div style={{ padding: "20px 16px 12px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={visitorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.12)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-outfit, sans-serif)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tickFormatter={(v) => v.replace("May ", "")}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-outfit, sans-serif)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#visitorGrad)"
                  dot={{ fill: "#fff", stroke: "#3B82F6", strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: "#3B82F6", stroke: "#fff", strokeWidth: 2, r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Col 3 — Quick Actions + Profile Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick Actions */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}
          >
            <div
              className="px-5 py-4"
              style={{ borderBottom: "1px solid var(--admin-border)" }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                }}
              >
                Quick Actions
              </h3>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Primary action */}
              <Link
                href="/admin/projects"
                className="flex items-center gap-2 rounded-lg transition-all duration-200"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "var(--brand-primary)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--brand-hover)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--brand-primary)")}
              >
                <Plus size={16} /> Add New Project
              </Link>
              {/* Secondary actions */}
              {[
                { icon: Upload, label: "Upload New Resume", href: "/admin/resume" },
                { icon: Briefcase, label: "Add Experience", href: "/admin/experience" },
                { icon: UserCog, label: "Update Profile Info", href: "/admin/settings" },
              ].map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-2 rounded-lg transition-all duration-200"
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-outfit, sans-serif)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)")}
                >
                  <Icon size={15} style={{ color: "var(--text-muted)" }} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Status */}
          <div
            className="rounded-xl"
            style={{
              background: "var(--admin-card-bg)",
              border: "1px solid var(--admin-border)",
              padding: 16,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-outfit, sans-serif)",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              Profile Status
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Profile Complete", value: "100%" },
                { label: "Resume Updated", value: "May 10, 2025" },
                { label: "Open to Work", value: "Enabled", green: true },
                { label: "Email Verified", value: "Verified", green: true },
              ].map(({ label, value, green }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 18,
                        height: 18,
                        background: "rgba(16,185,129,0.15)",
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={11} style={{ color: "var(--emerald)" }} />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-outfit, sans-serif)",
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit, sans-serif)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: green ? "var(--emerald)" : "var(--text-primary)",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom 2-column row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Col 1 — Recent Messages */}
        <SectionCard title="Recent Messages" action="View All" actionHref="/admin/contact-messages">
          {recentMessages.length === 0 ? (
            /* Mock message to always show something */
            <div className="px-5 py-4">
              <div
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "var(--admin-hover)" }}
              >
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0 font-bold text-white text-sm"
                  style={{ width: 38, height: 38, background: "#3B82F6" }}
                >
                  A
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontFamily: "var(--font-outfit, sans-serif)",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        Aman Verma
                      </span>
                      <span
                        style={{
                          background: "rgba(59,130,246,0.15)",
                          color: "var(--brand-primary)",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 100,
                        }}
                      >
                        New
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        flexShrink: 0,
                      }}
                    >
                      May 24, 2025
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit, sans-serif)",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      color: "var(--text-primary)",
                      marginBottom: 2,
                    }}
                  >
                    Project Collaboration
                  </p>
                  <p
                    className="truncate"
                    style={{
                      fontFamily: "var(--font-outfit, sans-serif)",
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    Hi Nilesh, I came across your portfolio and i...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {recentMessages.map((msg, i) => {
                const initial = msg.name?.[0]?.toUpperCase() || "?";
                const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];
                const bg = colors[i % colors.length];
                return (
                  <div
                    key={msg.id}
                    className="flex items-start gap-3 px-5 py-3.5 transition-colors"
                    style={{
                      borderBottom: i < recentMessages.length - 1 ? "1px solid var(--admin-border)" : "none",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--admin-hover)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0 font-bold text-white text-sm"
                      style={{ width: 36, height: 36, background: bg }}
                    >
                      {initial}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            style={{
                              fontFamily: "var(--font-outfit, sans-serif)",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: "var(--text-primary)",
                            }}
                          >
                            {msg.name}
                          </span>
                          {!msg.is_read && (
                            <span
                              style={{
                                background: "rgba(59,130,246,0.15)",
                                color: "var(--brand-primary)",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                padding: "2px 7px",
                                borderRadius: 100,
                              }}
                            >
                              New
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0 }}>
                          {new Date(msg.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="truncate" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Col 2 — Resume + Storage */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Resume card */}
          <SectionCard title="Resume">
            <div className="px-5 py-4 flex items-center gap-4">
              {/* PDF icon */}
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width: 48,
                  height: 48,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <FileText size={22} style={{ color: "var(--red)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  className="truncate"
                  style={{
                    fontFamily: "var(--font-outfit, sans-serif)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Nilesh_Kumar_Singh_Resume.pdf
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Uploaded on May 10, 2025 · 246 KB
                </p>
              </div>
              <button
                className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
                style={{
                  padding: "7px 14px",
                  background: "transparent",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-primary)";
                  (e.currentTarget as HTMLElement).style.color = "var(--brand-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }}
              >
                <Download size={13} /> Download
              </button>
            </div>
          </SectionCard>

          {/* Storage Usage */}
          <div
            className="rounded-xl"
            style={{
              background: "var(--admin-card-bg)",
              border: "1px solid var(--admin-border)",
              padding: 20,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                style={{
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                }}
              >
                Storage Usage
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                }}
              >
                2.4 GB / 10 GB
              </span>
            </div>
            {/* Progress bar */}
            <div
              className="rounded-full overflow-hidden"
              style={{ height: 6, background: "var(--bg-tertiary)" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: "24%", background: "var(--brand-primary)" }}
              />
            </div>
            <p
              className="text-right mt-1.5"
              style={{
                fontFamily: "var(--font-outfit, sans-serif)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              24% used
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
