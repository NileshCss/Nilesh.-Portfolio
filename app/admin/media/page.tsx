"use client";
import { ImageIcon, Upload, Grid, List, Search } from "lucide-react";

const mockMedia = [
  { name: "project-moksha.jpg", type: "image", size: "124 KB", color: "#3B82F6" },
  { name: "portfolio-og.png", type: "image", size: "89 KB", color: "#8B5CF6" },
  { name: "resume-v2.pdf", type: "pdf", size: "246 KB", color: "#EF4444" },
  { name: "village-connect.jpg", type: "image", size: "178 KB", color: "#10B981" },
  { name: "profile-photo.webp", type: "image", size: "56 KB", color: "#F59E0B" },
  { name: "naam-haat.jpg", type: "image", size: "201 KB", color: "#EC4899" },
];

export default function MediaPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>Media Library</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>124 files · 2.4 GB of 10 GB used</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg" style={{ padding: "10px 18px", background: "var(--brand-primary)", color: "#fff", border: "none", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
          <Upload size={15} /> Upload Files
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input placeholder="Search files..." style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", borderRadius: 8, color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem", outline: "none" }} />
        </div>
        <select style={{ padding: "10px 14px", background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", borderRadius: 8, color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem", outline: "none" }}>
          <option>All Types</option>
          <option>Images</option>
          <option>PDFs</option>
          <option>Videos</option>
        </select>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
          <button style={{ padding: "6px 10px", background: "var(--brand-primary)", borderRadius: 6, border: "none", color: "#fff", cursor: "pointer" }}><Grid size={15} /></button>
          <button style={{ padding: "6px 10px", background: "transparent", borderRadius: 6, border: "none", color: "var(--text-muted)", cursor: "pointer" }}><List size={15} /></button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {mockMedia.map((file) => (
          <div
            key={file.name}
            className="group relative rounded-xl overflow-hidden cursor-pointer transition-all"
            style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", aspectRatio: "1" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--brand-primary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--admin-border)")}
          >
            <div className="flex items-center justify-center w-full h-full" style={{ background: `${file.color}15` }}>
              <ImageIcon size={32} style={{ color: file.color }} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: "var(--admin-card-bg)", borderTop: "1px solid var(--admin-border)" }}>
              <p className="truncate" style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-primary)" }}>{file.name}</p>
              <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{file.size}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Storage bar */}
      <div className="rounded-xl p-5" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>Storage Usage</span>
          <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>2.4 GB of 10 GB used</span>
        </div>
        <div className="rounded-full" style={{ height: 8, background: "var(--bg-tertiary)" }}>
          <div className="h-full rounded-full" style={{ width: "24%", background: "var(--brand-primary)" }} />
        </div>
      </div>
    </div>
  );
}
