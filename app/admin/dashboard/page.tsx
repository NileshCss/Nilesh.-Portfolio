"use client";

import { useEffect, useState, useCallback } from "react";
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
  Plus,
  Upload,
  Briefcase,
  UserCog,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RefreshCw,
  X,
  HelpCircle,
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
interface DashboardAPIData {
  stats: {
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
    projectChangeStr: string;
    projectChangeColor: string;

    totalVisitors: number;
    currVisitors: number;
    visitorChangeStr: string;
    visitorChangeColor: string;

    totalProfileViews: number;
    currViews: number;
    viewsChangeStr: string;
    viewsChangeColor: string;

    totalResumeDownloads: number;
    currDownloads: number;
    downloadsChangeStr: string;
    downloadsChangeColor: string;

    totalMessages: number;
    unreadMessages: number;
    newMessagesThisPeriod: number;
  };
  chartSeries: Array<{ day: string; visitors: number; pageViews: number }>;
  profileStatus: {
    completenessPct: string;
    completedItems: number;
    totalItems: number;
    checklist: Array<{ key: string; label: string; ok: boolean }>;
    openToWork: boolean;
    resumeUpdatedDate: string;
  };
  recentProjects: Array<{
    id: string;
    title: string;
    status: string;
    updated_at: string;
    live_url: string | null;
    category: string;
  }>;
  recentMessages: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    subject?: string;
    is_read: boolean;
    created_at: string;
  }>;
  activeResume: {
    url: string;
    fileName: string;
    fileSize: string;
    uploadedDate: string;
  };
  storageUsage: {
    display: string;
    percentage: string;
  };
}

const projectColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

function timeAgo(dateStr: string) {
  if (!dateStr) return "recently";
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
}

function projectStatus(status: string) {
  if (status === "live" || status === "completed") return "Published";
  if (status === "development") return "Draft";
  return "Published";
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

/* ───────────── Main Page Component ───────────── */
export default function AdminDashboard() {
  const [range, setRange] = useState<string>("7d");
  const [data, setData] = useState<DashboardAPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/dashboard?range=${range}`);
      if (!res.ok) {
        throw new Error(`Failed to load dashboard metrics (${res.status})`);
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchDashboard();

    // Subscribe to realtime changes on contact_messages and projects
    const channel = supabase
      .channel("admin-dashboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => fetchDashboard())
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchDashboard())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDashboard, supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4" style={{ minHeight: "60vh" }}>
        <div
          className="rounded-full animate-spin"
          style={{
            width: 36,
            height: 36,
            border: "3px solid var(--brand-pale)",
            borderTopColor: "var(--brand-primary)",
          }}
        />
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Loading portfolio dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/10 rounded-2xl p-8 text-center my-8">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Unable to load dashboard analytics.</h3>
        <p className="text-xs text-red-500/80 mb-5">{error}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const { stats, chartSeries, profileStatus, recentProjects, recentMessages, activeResume, storageUsage } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      
      {/* ── Range Selector Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit, sans-serif)", fontWeight: 800, fontSize: "1.35rem", color: "var(--text-primary)" }}>
            Overview
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 2 }}>
            Real-time analytics and CMS overview from production database.
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
          {[
            { label: "7 Days", val: "7d" },
            { label: "30 Days", val: "30d" },
            { label: "90 Days", val: "90d" },
          ].map((b) => (
            <button
              key={b.val}
              onClick={() => setRange(b.val)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                background: range === b.val ? "var(--brand-primary)" : "transparent",
                color: range === b.val ? "#FFFFFF" : "var(--text-muted)",
                border: "none",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 5 Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          label="Total Projects"
          value={stats.totalProjects}
          change={stats.projectChangeStr}
          changeLabel={`(${stats.publishedProjects} published)`}
          changeColor={stats.projectChangeColor}
          icon={Code2}
          iconBg="rgba(37,99,235,0.15)"
          iconColor="#3B82F6"
        />
        <StatsCard
          label="Total Visitors"
          value={stats.currVisitors.toLocaleString()}
          change={stats.visitorChangeStr}
          changeLabel="vs prev period"
          changeColor={stats.visitorChangeColor}
          icon={BarChart2}
          iconBg="rgba(16,185,129,0.15)"
          iconColor="#10B981"
        />
        <StatsCard
          label="Profile Views"
          value={stats.currViews.toLocaleString()}
          change={stats.viewsChangeStr}
          changeLabel="vs prev period"
          changeColor={stats.viewsChangeColor}
          icon={Eye}
          iconBg="rgba(124,58,237,0.15)"
          iconColor="#7C3AED"
        />
        <StatsCard
          label="Resume Downloads"
          value={stats.currDownloads}
          change={stats.downloadsChangeStr}
          changeLabel=""
          changeColor={stats.downloadsChangeColor}
          icon={Download}
          iconBg="rgba(245,158,11,0.15)"
          iconColor="#F59E0B"
        />
        <StatsCard
          label="Contact Messages"
          value={stats.totalMessages}
          change={`↑ ${stats.unreadMessages}`}
          changeLabel="unread"
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
            {recentProjects.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Code2 size={28} style={{ margin: "0 auto 8px", color: "var(--text-muted)", opacity: 0.4 }} />
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No projects found in database.</p>
                <Link href="/admin/projects" style={{ fontSize: "0.8rem", color: "var(--brand-primary)", textDecoration: "none" }}>Add your first project →</Link>
              </div>
            ) : (
              recentProjects.map((project, i) => {
                const color = projectColors[i % projectColors.length];
                return (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 px-5 py-3 transition-colors"
                    style={{
                      borderBottom: i < recentProjects.length - 1 ? "1px solid var(--admin-border)" : "none",
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
            {chartSeries.length === 0 || chartSeries.every((d) => d.visitors === 0) ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <BarChart2 size={32} style={{ color: "var(--text-muted)", opacity: 0.3, marginBottom: 8 }} />
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No visitor data logged for this period.</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", opacity: 0.6, marginTop: 2 }}>Events log automatically as visitors browse.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
            )}
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
            <div className="flex items-center justify-between mb-3">
              <h3
                style={{
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                }}
              >
                Profile Status
              </h3>
              <button
                onClick={() => setShowChecklistModal(true)}
                title="View completeness breakdown"
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-semibold cursor-pointer"
              >
                <HelpCircle size={13} />
                Breakdown
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Profile Complete", value: profileStatus.completenessPct },
                { label: "Resume Updated", value: profileStatus.resumeUpdatedDate },
                { label: "Open to Work", value: profileStatus.openToWork ? "Enabled" : "Disabled", green: profileStatus.openToWork },
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
            <div className="px-5 py-12 text-center text-slate-400">
              <Mail className="w-9 h-9 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No recent messages found.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Submitted contact form entries will appear here.</p>
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
                    className="flex items-start gap-3 px-5 py-3.5 transition-colors cursor-pointer"
                    onClick={() => router.push("/admin/contact-messages")}
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

        {/* Col 2 — Active Resume + Storage Usage */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Resume Card */}
          <SectionCard title="Active Resume">
            <div className="px-5 py-4 flex items-center gap-4">
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
                  {activeResume.fileName}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Uploaded on {activeResume.uploadedDate} · {activeResume.fileSize}
                </p>
              </div>
              {activeResume.url ? (
                <a
                  href={activeResume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
                  style={{
                    padding: "7px 14px",
                    background: "transparent",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-outfit, sans-serif)",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    textDecoration: "none",
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
                </a>
              ) : (
                <Link
                  href="/admin/resume"
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                >
                  Upload
                </Link>
              )}
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
                {storageUsage.display}
              </span>
            </div>
            {/* Progress bar */}
            <div
              className="rounded-full overflow-hidden"
              style={{ height: 6, background: "var(--bg-tertiary)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: storageUsage.percentage, background: "var(--brand-primary)" }}
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
              {storageUsage.percentage} used
            </p>
          </div>
        </div>
      </div>

      {/* ── Checklist Breakdown Modal ── */}
      {showChecklistModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-150 dark:border-slate-800 max-w-md w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Profile Completeness Checklist</h3>
              <button onClick={() => setShowChecklistModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {profileStatus.checklist.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                  {item.ok ? (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      Incomplete
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowChecklistModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
