"use client";
import { Search, Save } from "lucide-react";
import { useState } from "react";

const tabs = ["Global SEO", "Per-Page SEO", "Schema", "Sitemap", "Robots"];

export default function SeoPage() {
  const [activeTab, setActiveTab] = useState("Global SEO");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000 }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>SEO Manager</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>Manage your portfolio&apos;s SEO settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", width: "fit-content" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontFamily: "var(--font-outfit,sans-serif)",
              fontWeight: 500,
              fontSize: "0.875rem",
              background: activeTab === tab ? "var(--brand-primary)" : "transparent",
              color: activeTab === tab ? "#fff" : "var(--text-muted)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 28 }}>
        {activeTab === "Global SEO" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Global SEO Settings</h3>
            {[
              { label: "Default Meta Title", placeholder: "Nilesh Kumar Singh — Full Stack Java Developer", type: "input" },
              { label: "Default Meta Description", placeholder: "Full Stack Java Developer building scalable SaaS platforms...", type: "textarea" },
              { label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX", type: "input" },
              { label: "Microsoft Clarity ID", placeholder: "xxxxxxxxxx", type: "input" },
            ].map(({ label, placeholder, type }) => (
              <div key={label}>
                <label style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>{label}</label>
                {type === "textarea" ? (
                  <textarea placeholder={placeholder} rows={3} style={{ width: "100%", borderRadius: 8, padding: "10px 12px", background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
                ) : (
                  <input placeholder={placeholder} style={{ width: "100%", borderRadius: 8, padding: "10px 12px", background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem", outline: "none" }} />
                )}
              </div>
            ))}
            <button className="flex items-center gap-2 rounded-lg self-start" style={{ padding: "10px 20px", background: "var(--brand-primary)", color: "#fff", border: "none", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
              <Save size={15} /> Save Changes
            </button>
          </div>
        )}
        {activeTab !== "Global SEO" && (
          <div className="flex flex-col items-center justify-center" style={{ padding: "60px 40px", textAlign: "center" }}>
            <Search size={40} style={{ color: "var(--text-light)", marginBottom: 16 }} />
            <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 8 }}>{activeTab}</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>This section is available in the full implementation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
