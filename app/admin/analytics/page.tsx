"use client";
import { BarChart2, Users, Eye, Clock, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const visitorsData = [
  { date: "May 18", visitors: 450 }, { date: "May 19", visitors: 600 },
  { date: "May 20", visitors: 580 }, { date: "May 21", visitors: 650 },
  { date: "May 22", visitors: 750 }, { date: "May 23", visitors: 900 },
  { date: "May 24", visitors: 1100 },
];

const trafficSources = [
  { name: "Direct", value: 35, color: "#3B82F6" },
  { name: "Google", value: 28, color: "#10B981" },
  { name: "LinkedIn", value: 20, color: "#0A66C2" },
  { name: "GitHub", value: 12, color: "#24292e" },
  { name: "Other", value: 5, color: "#94A3B8" },
];

const overviewStats = [
  { label: "Total Visitors", value: "5,482", icon: Users, change: "+18.7%" },
  { label: "Page Views", value: "12,840", icon: Eye, change: "+12.4%" },
  { label: "Bounce Rate", value: "42.3%", icon: TrendingUp, change: "-3.2%" },
  { label: "Avg Session", value: "2m 48s", icon: Clock, change: "+8.1%" },
];

export default function AnalyticsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200 }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>Analytics</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>Portfolio performance and visitor insights.</p>
      </div>

      {/* Overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {overviewStats.map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="rounded-xl p-5" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
            <div className="flex items-start justify-between mb-3">
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{label}</p>
              <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: "rgba(59,130,246,0.1)" }}>
                <Icon size={18} style={{ color: "var(--brand-primary)" }} />
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.75rem", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{value}</p>
            <p style={{ fontSize: "0.78rem", color: "var(--emerald)", marginTop: 4 }}>{change} this month</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        {/* Visitors over time */}
        <div className="rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: 20 }}>Visitors Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={visitorsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} fill="url(#grad)" dot={{ fill: "#fff", stroke: "#3B82F6", strokeWidth: 2, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic sources */}
        <div className="rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: 20 }}>Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={trafficSources} cx="50%" cy="50%" outerRadius={65} dataKey="value" strokeWidth={0}>
                {trafficSources.map(({ color }, i) => <Cell key={i} fill={color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {trafficSources.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full" style={{ width: 8, height: 8, background: color }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{name}</span>
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
