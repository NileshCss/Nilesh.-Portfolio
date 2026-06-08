"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Download, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  ChevronDown,
  ChevronUp,
  Globe
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

/* ───────────── Seeded Random Helper ───────────── */
// Simple seeded random helper to make data look consistent but dynamic
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/* ───────────── Helper to Generate Analytics Data ───────────── */
interface DayData {
  date: string;
  visitors: number;
  views: number;
  downloads: number;
}

function generateAnalyticsData(range: string, customStart?: string, customEnd?: string) {
  let start = new Date();
  let end = new Date();
  let days = 7;

  if (range === "7d") {
    days = 7;
    start.setDate(end.getDate() - 6);
  } else if (range === "30d") {
    days = 30;
    start.setDate(end.getDate() - 29);
  } else if (range === "90d") {
    days = 90;
    start.setDate(end.getDate() - 89);
  } else if (range === "custom" && customStart && customEnd) {
    const s = new Date(customStart);
    const e = new Date(customEnd);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
      start = s;
      end = e;
      days = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    }
  }

  const data: DayData[] = [];
  const curr = new Date(start);
  
  for (let i = 0; i < days; i++) {
    if (curr > end) break;
    const dateStr = curr.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    // Seed using date string hash to make data consistent for the same date
    const seed = curr.getFullYear() * 10000 + (curr.getMonth() + 1) * 100 + curr.getDate();
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 1);
    
    const dayOfWeek = curr.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseline = isWeekend ? 220 : 410;
    
    const visitors = Math.round(baseline + r1 * 180);
    const views = Math.round(visitors * (1.6 + r2 * 0.7));
    const downloads = Math.round(visitors * (0.05 + r1 * 0.08));

    data.push({
      date: dateStr,
      visitors,
      views,
      downloads,
    });
    
    curr.setDate(curr.getDate() + 1);
  }
  return data;
}

/* ───────────── Custom Tooltip Component ───────────── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-strong)",
          borderRadius: 8,
          padding: "10px 14px",
          boxShadow: "var(--shadow-nav)",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4, fontWeight: 500 }}>
          {label}
        </p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} style={{ fontSize: "0.85rem", fontWeight: 700, color: p.color || "var(--brand-primary)", margin: 0 }}>
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [range, setRange] = useState<string>("7d");
  const [customStart, setCustomStart] = useState<string>(
    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [customEnd, setCustomEnd] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"page" | "views" | "unique" | "time" | "bounce">("views");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Generate date-range data
  const data = useMemo(() => {
    return generateAnalyticsData(range, customStart, customEnd);
  }, [range, customStart, customEnd]);

  // Aggregate stats
  const totals = useMemo(() => {
    let visitors = 0;
    let views = 0;
    let downloads = 0;
    data.forEach((d) => {
      visitors += d.visitors;
      views += d.views;
      downloads += d.downloads;
    });
    
    // Average bounce rate & session duration
    const bounceRate = 42.3; // stable metric
    const avgSessionSec = 168; // 2m 48s

    return { visitors, views, downloads, bounceRate, avgSessionSec };
  }, [data]);

  // Pie chart traffic sources data
  const trafficSources = useMemo(() => {
    const total = totals.visitors || 1;
    return [
      { name: "Direct", value: Math.round(total * 0.35), color: "#3B82F6" },
      { name: "Google", value: Math.round(total * 0.28), color: "#10B981" },
      { name: "LinkedIn", value: Math.round(total * 0.20), color: "#0A66C2" },
      { name: "GitHub", value: Math.round(total * 0.12), color: "#6366F1" },
      { name: "Other", value: Math.round(total * 0.05), color: "#94A3B8" },
    ];
  }, [totals]);

  // Device types data
  const deviceData = useMemo(() => {
    const total = totals.visitors || 1;
    return [
      { name: "Desktop", value: Math.round(total * 0.62), color: "#3B82F6" },
      { name: "Mobile", value: Math.round(total * 0.31), color: "#8B5CF6" },
      { name: "Tablet", value: Math.round(total * 0.07), color: "#EC4899" },
    ];
  }, [totals]);

  // Pages data list
  const pagesList = useMemo(() => {
    const totalViews = totals.views || 1;
    const basePages = [
      { page: "/", views: Math.round(totalViews * 0.45), unique: Math.round(totals.visitors * 0.46), time: "3m 12s", bounce: 38.5 },
      { page: "/projects", views: Math.round(totalViews * 0.25), unique: Math.round(totals.visitors * 0.24), time: "2m 45s", bounce: 42.1 },
      { page: "/about", views: Math.round(totalViews * 0.15), unique: Math.round(totals.visitors * 0.16), time: "1m 58s", bounce: 45.3 },
      { page: "/contact", views: Math.round(totalViews * 0.10), unique: Math.round(totals.visitors * 0.09), time: "1m 15s", bounce: 52.8 },
      { page: "/blog", views: Math.round(totalViews * 0.05), unique: Math.round(totals.visitors * 0.05), time: "4m 20s", bounce: 35.0 },
    ];
    return basePages;
  }, [totals]);

  // Top Pages horizontal bar chart data
  const topPagesChartData = useMemo(() => {
    return pagesList.slice(0, 5).map(p => ({
      name: p.page,
      views: p.views
    })).sort((a,b) => a.views - b.views); // Sorted ascending for horizontal bar chart rendering
  }, [pagesList]);

  // Sorted and filtered table pages
  const sortedPages = useMemo(() => {
    const filtered = pagesList.filter((p) =>
      p.page.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      // Convert time string "Xm Ys" to seconds for sorting
      if (sortField === "time") {
        const parseTime = (t: string) => {
          const parts = t.split(" ");
          const m = parseInt(parts[0]) || 0;
          const s = parseInt(parts[1]) || 0;
          return m * 60 + s;
        };
        valA = parseTime(a.time);
        valB = parseTime(b.time);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [pagesList, searchQuery, sortField, sortOrder]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Page", "Page Views", "Unique Visitors", "Avg Time on Page", "Bounce Rate (%)"];
    const rows = pagesList.map((p) => [
      p.page,
      p.views.toString(),
      p.unique.toString(),
      p.time,
      `${p.bounce}%`
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `analytics_top_pages_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
            Analytics Dashboard
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
            Monitor portfolio views, traffic sources, and resume downloads.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2" style={{ background: "var(--admin-card-bg)", padding: 4, borderRadius: 10, border: "1px solid var(--admin-border)" }}>
          {[
            { label: "7 Days", val: "7d" },
            { label: "30 Days", val: "30d" },
            { label: "90 Days", val: "90d" },
            { label: "Custom", val: "custom" },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setRange(item.val)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: range === item.val ? "var(--brand-primary)" : "transparent",
                color: range === item.val ? "#fff" : "var(--text-muted)",
                border: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Inputs if Custom Selected */}
      {range === "custom" && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", width: "fit-content" }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Start Date:</span>
            <input 
              type="date" 
              value={customStart} 
              onChange={(e) => setCustomStart(e.target.value)}
              style={{ padding: "6px 10px", background: "var(--bg-secondary)", border: "1px solid var(--admin-border)", borderRadius: 6, color: "var(--text-primary)", fontSize: "0.8rem", outline: "none" }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>End Date:</span>
            <input 
              type="date" 
              value={customEnd} 
              onChange={(e) => setCustomEnd(e.target.value)}
              style={{ padding: "6px 10px", background: "var(--bg-secondary)", border: "1px solid var(--admin-border)", borderRadius: 6, color: "var(--text-primary)", fontSize: "0.8rem", outline: "none" }}
            />
          </div>
        </div>
      )}

      {/* ── Overview Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Visitors", value: totals.visitors.toLocaleString(), change: "+18.7%", up: true, icon: Users, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
          { label: "Page Views", value: totals.views.toLocaleString(), change: "+24.3%", up: true, icon: Eye, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
          { label: "Bounce Rate", value: `${totals.bounceRate}%`, change: "-3.2%", up: false, icon: TrendingUp, color: "#EC4899", bg: "rgba(236,72,153,0.1)" },
          { label: "Avg Session", value: `${Math.floor(totals.avgSessionSec / 60)}m ${totals.avgSessionSec % 60}s`, change: "+8.1%", up: true, icon: Clock, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl p-5" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
              <div className="flex items-start justify-between mb-3">
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{c.label}</p>
                <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: c.bg }}>
                  <Icon size={18} style={{ color: c.color }} />
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.75rem", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{c.value}</p>
              
              <div className="flex items-center gap-1 mt-2">
                {c.up ? (
                  <ArrowUpRight size={14} style={{ color: "var(--emerald)" }} />
                ) : (
                  <ArrowDownRight size={14} style={{ color: "var(--red)" }} />
                )}
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: c.up ? "var(--emerald)" : "var(--red)" }}>{c.change}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: 2 }}>vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row 1: Visitors & Sources ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        {/* Visitors over time AreaChart */}
        <div className="rounded-xl p-6" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 20 }}>
            Visitors Over Time
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Area type="monotone" name="Page Views" dataKey="views" stroke="#10B981" strokeWidth={2} fill="url(#gradViews)" dot={{ fill: "#fff", stroke: "#10B981", strokeWidth: 1.5, r: 3 }} />
              <Area type="monotone" name="Unique Visitors" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} fill="url(#gradVisitors)" dot={{ fill: "#fff", stroke: "#3B82F6", strokeWidth: 1.5, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources PieChart */}
        <div className="rounded-xl p-6" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 20 }}>
            Traffic Sources
          </h3>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie 
                  data={trafficSources} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={0}
                  outerRadius={65} 
                  dataKey="value" 
                  strokeWidth={2}
                  stroke="var(--admin-card-bg)"
                >
                  {trafficSources.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {trafficSources.map(({ name, value, color }) => {
              const percentage = Math.round((value / totals.visitors) * 100);
              return (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full" style={{ width: 8, height: 8, background: color }} />
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{value.toLocaleString()}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", width: 36, textAlign: "right" }}>{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Charts Row 2: Top Pages & Device Types ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
        
        {/* Top Pages Horizontal Bar Chart */}
        <div className="rounded-xl p-6" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 20 }}>
            Top Pages by Views
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart 
              data={topPagesChartData} 
              layout="vertical" 
              margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "var(--text-primary)", fontFamily: "var(--font-mono, monospace)" }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="views" name="Page Views" fill="var(--brand-primary)" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Types DonutChart */}
        <div className="rounded-xl p-6" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 20 }}>
            Device Types
          </h3>
          <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie 
                  data={deviceData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={52}
                  outerRadius={68} 
                  dataKey="value" 
                  strokeWidth={2}
                  stroke="var(--admin-card-bg)"
                >
                  {deviceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label for Donut Chart */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em" }}>Total Sessions</p>
              <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-outfit, sans-serif)" }}>{totals.visitors.toLocaleString()}</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
            {deviceData.map(({ name, value, color }) => {
              const percentage = Math.round((value / totals.visitors) * 100);
              return (
                <div key={name} className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="rounded-full" style={{ width: 8, height: 8, background: color }} />
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{name}</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Top Pages Searchable/Sortable Table ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5" style={{ borderBottom: "1px solid var(--admin-border)" }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
            Pages Performance Table
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center" style={{ width: 220 }}>
              <Search size={14} style={{ position: "absolute", left: 12, color: "var(--text-muted)" }} />
              <input 
                type="text" 
                placeholder="Search page path..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 32px",
                  borderRadius: 8,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--admin-border)",
                  color: "var(--text-primary)",
                  fontSize: "0.8rem",
                  fontFamily: "var(--font-outfit, sans-serif)",
                  outline: "none"
                }}
              />
            </div>
            
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer"
              style={{
                padding: "8px 14px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--admin-border)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-outfit, sans-serif)",
                fontWeight: 600,
                fontSize: "0.8rem",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)")}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: 800 }}>
            {/* Table Header */}
            <div className="flex items-center px-6 py-3" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--admin-border)" }}>
              {[
                { label: "Page Path", field: "page" },
                { label: "Page Views", field: "views" },
                { label: "Unique Visitors", field: "unique" },
                { label: "Avg Time on Page", field: "time" },
                { label: "Bounce Rate", field: "bounce" }
              ].map(({ label, field }) => (
                <button
                  key={field}
                  onClick={() => handleSort(field as any)}
                  className="flex items-center gap-1"
                  style={{
                    flex: field === "page" ? 2 : 1,
                    background: "transparent",
                    border: "none",
                    fontFamily: "var(--font-outfit,sans-serif)",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 0,
                    outline: "none"
                  }}
                >
                  {label}
                  {sortField === field ? (
                    sortOrder === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  ) : null}
                </button>
              ))}
            </div>

            {/* Table Rows */}
            {sortedPages.length === 0 ? (
              <div className="text-center py-10">
                <Globe size={32} style={{ margin: "0 auto 8px", color: "var(--text-muted)", opacity: 0.3 }} />
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No page matching search query found.</p>
              </div>
            ) : (
              sortedPages.map((p, idx) => (
                <div
                  key={p.page}
                  className="flex items-center px-6 py-4 transition-colors"
                  style={{ 
                    borderBottom: idx < sortedPages.length - 1 ? "1px solid var(--admin-border)" : "none",
                    fontFamily: "var(--font-outfit, sans-serif)",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--admin-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <span style={{ flex: 2, fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono, monospace)" }}>
                    {p.page}
                  </span>
                  <span style={{ flex: 1, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {p.views.toLocaleString()}
                  </span>
                  <span style={{ flex: 1, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {p.unique.toLocaleString()}
                  </span>
                  <span style={{ flex: 1, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {p.time}
                  </span>
                  <span style={{ flex: 1, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {p.bounce}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Resume Downloads Analytics Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5" style={{ marginBottom: 12 }}>
        
        {/* Daily Downloads Chart */}
        <div className="rounded-xl p-6" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 20 }}>
            Resume Downloads Trend
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="downloads" name="Downloads" fill="#F59E0B" radius={[3, 3, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resume Download KPI Stats */}
        <div className="rounded-xl p-6" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} style={{ color: "#F59E0B" }} />
              <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", margin: 0 }}>
                Resume KPI Summary
              </h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>
              Historical downloads metrics for your active resume version.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Total Downloads", value: totals.downloads.toLocaleString() },
                { label: "This Month", value: Math.round(totals.downloads * 0.4).toLocaleString() },
                { label: "This Week", value: Math.round(totals.downloads * 0.15).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-4" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", padding: 12, borderRadius: 10 }}>
            <TrendingUp size={14} style={{ color: "#F59E0B" }} />
            <span style={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 600 }}>+8.3% increase in downloads</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: 2 }}>vs last week</span>
          </div>
        </div>

      </div>

    </div>
  );
}
