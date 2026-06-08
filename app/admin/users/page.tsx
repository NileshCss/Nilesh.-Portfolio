"use client";
import { Users, Plus, Shield, Mail } from "lucide-react";

export default function UsersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>Users</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>Manage admin users and permissions.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg" style={{ padding: "10px 18px", background: "var(--brand-primary)", color: "#fff", border: "none", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
          <Plus size={15} /> Invite User
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-3" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--admin-border)" }}>
          {["User", "Role", "Status", "Last Active", "Actions"].map((h) => (
            <span key={h} style={{ flex: 1, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
          ))}
        </div>

        {/* Admin user row */}
        <div className="flex items-center gap-4 px-5 py-4">
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: "#0F172A", border: "1.5px solid var(--border-strong)", flexShrink: 0, borderRadius: "22%" }}>
              <span style={{ fontFamily: "Arial,sans-serif", fontWeight: 900, fontSize: 17, color: "#FFFFFF" }}>N</span>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>Nilesh Kumar Singh</p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>rajputnileshsingh25@gmail.com</p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <span className="flex items-center gap-1.5" style={{ borderRadius: 100, padding: "3px 12px", background: "rgba(37,99,235,0.1)", color: "var(--brand-primary)", fontWeight: 600, fontSize: "0.78rem", width: "fit-content" }}>
              <Shield size={11} /> Admin
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ borderRadius: 100, padding: "3px 12px", background: "rgba(16,185,129,0.1)", color: "var(--emerald)", fontWeight: 600, fontSize: "0.78rem" }}>Active</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Just now</p>
          </div>
          <div style={{ flex: 1 }}>
            <button style={{ padding: "6px 14px", background: "transparent", border: "1px solid var(--border-default)", borderRadius: 8, color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer" }}>
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="rounded-xl p-5 flex items-start gap-3" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <Mail size={18} style={{ color: "var(--brand-primary)", flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: 4 }}>User Management via Supabase Auth</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Invite additional administrators via Supabase Auth dashboard. User roles and permissions are managed through Supabase RLS policies.
          </p>
        </div>
      </div>
    </div>
  );
}
