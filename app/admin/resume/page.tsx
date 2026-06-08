"use client";
import { FileText, Upload, Download, Trash2 } from "lucide-react";

export default function ResumePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200 }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
          Resume Management
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
          Manage your resume files and track downloads.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Current Resume */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 24 }}>
            <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 16 }}>
              Current Resume
            </h3>
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}>
              <div className="flex items-center justify-center rounded-xl" style={{ width: 56, height: 56, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <FileText size={28} style={{ color: "var(--red)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                  Nilesh_Kumar_Singh_Resume.pdf
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Uploaded May 10, 2025 · 246 KB</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="flex items-center gap-2 rounded-lg flex-1 justify-center" style={{ padding: "10px 16px", background: "var(--brand-primary)", color: "#fff", border: "none", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
                <Download size={15} /> Download
              </button>
              <button className="flex items-center gap-2 rounded-lg flex-1 justify-center" style={{ padding: "10px 16px", background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-default)", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
                <Upload size={15} /> Replace
              </button>
              <button className="flex items-center gap-2 rounded-lg" style={{ padding: "10px 14px", background: "var(--red-pale)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.2)", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Analytics */}
          <div className="rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 24 }}>
            <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 16 }}>
              Download Analytics
            </h3>
            {[
              { label: "Total Downloads", value: "328" },
              { label: "This Month", value: "47" },
              { label: "This Week", value: "12" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: "1px solid var(--border-default)" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--brand-primary)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Zone */}
        <div className="rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 16 }}>
            Upload New Resume
          </h3>
          <div
            className="flex flex-col items-center justify-center rounded-xl"
            style={{
              border: "2px dashed var(--border-strong)",
              background: "var(--bg-secondary)",
              padding: "60px 40px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Upload size={48} style={{ color: "var(--text-light)", marginBottom: 16 }} />
            <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 6 }}>
              Drag your resume PDF here
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: 16 }}>or click to browse</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>PDF only · Max 5MB</p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Allow public download</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Anyone can download your resume</p>
              </div>
              <div className="rounded-full" style={{ width: 44, height: 24, background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 3px", cursor: "pointer" }}>
                <div className="rounded-full" style={{ width: 18, height: 18, background: "#fff" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
