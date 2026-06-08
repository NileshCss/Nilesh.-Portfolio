"use client";
import { Award, Plus } from "lucide-react";

export default function CertificationsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
            Certifications
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
            Manage your professional certifications.
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg transition-all duration-200"
          style={{
            padding: "10px 18px",
            background: "var(--brand-primary)",
            color: "#fff",
            border: "none",
            fontFamily: "var(--font-outfit,sans-serif)",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          <Plus size={16} /> Add Certification
        </button>
      </div>

      <div
        className="rounded-xl flex flex-col items-center justify-center"
        style={{
          background: "var(--admin-card-bg)",
          border: "1px solid var(--admin-border)",
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full mb-5"
          style={{ width: 72, height: 72, background: "rgba(37,99,235,0.1)" }}
        >
          <Award size={32} style={{ color: "var(--brand-primary)" }} />
        </div>
        <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 8 }}>
          No certifications yet
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", maxWidth: 360 }}>
          Add your professional certifications from cloud providers, universities, and other issuers.
        </p>
      </div>
    </div>
  );
}
