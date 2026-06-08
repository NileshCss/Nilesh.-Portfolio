"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/hooks/useToast";
import { ImageIcon, Upload, Grid, List, Search, Trash2, FileText, Copy, Loader2, RefreshCw } from "lucide-react";

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileColor(mimeType: string | null) {
  if (!mimeType) return "#6B7280";
  if (mimeType.startsWith("image/")) return "#3B82F6";
  if (mimeType === "application/pdf") return "#EF4444";
  if (mimeType.startsWith("video/")) return "#8B5CF6";
  return "#F59E0B";
}

const FILE_TYPES = ["All Types", "Images", "PDFs", "Videos"];

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (error && error.code !== "42P01") {
      toast.error("Failed to load media: " + error.message);
    }
    setFiles(data ?? []);
    setLoading(false);
  }, [supabase, toast]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10MB.");
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase storage
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        // Fallback: just store in the DB table with a generated URL
        toast.warning("Storage upload failed, storing metadata only.");
        const { error: dbError } = await supabase.from("media_library").insert({
          name: file.name,
          url: URL.createObjectURL(file),
          size_bytes: file.size,
          mime_type: file.type,
        });
        if (dbError) toast.error("Failed to save: " + dbError.message);
        else toast.success("File metadata saved!");
      } else {
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(uploadData.path);
        const { error: dbError } = await supabase.from("media_library").insert({
          name: file.name,
          url: urlData.publicUrl,
          size_bytes: file.size,
          mime_type: file.type,
          bucket: "media",
        });
        if (dbError) toast.error("Upload succeeded but failed to save: " + dbError.message);
        else toast.success("File uploaded successfully!");
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchFiles();
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete "${file.name}"?`)) return;
    const { error } = await supabase.from("media_library").delete().eq("id", file.id);
    if (error) {
      toast.error("Failed to delete: " + error.message);
    } else {
      toast.success("File deleted!");
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const filtered = files.filter((f) => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === "All Types" ||
      (typeFilter === "Images" && f.mime_type?.startsWith("image/")) ||
      (typeFilter === "PDFs" && f.mime_type === "application/pdf") ||
      (typeFilter === "Videos" && f.mime_type?.startsWith("video/"));
    return matchSearch && matchType;
  });

  const totalSize = files.reduce((sum, f) => sum + (f.size_bytes ?? 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
            Media Library
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
            {files.length} files · {formatBytes(totalSize)} used
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchFiles}
            style={{ padding: "10px 12px", background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", borderRadius: 8, color: "var(--text-muted)", cursor: "pointer" }}
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,video/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg justify-center w-full sm:w-auto"
            style={{ padding: "10px 18px", background: "var(--brand-primary)", color: "#fff", border: "none", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", borderRadius: 8, color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem", outline: "none" }}
          />
        </div>
        <div className="flex gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 sm:flex-initial"
            style={{ padding: "10px 14px", background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", borderRadius: 8, color: "var(--text-primary)", fontFamily: "var(--font-outfit,sans-serif)", fontSize: "0.875rem", outline: "none" }}
          >
            {FILE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{ padding: "6px 10px", background: viewMode === "grid" ? "var(--brand-primary)" : "transparent", borderRadius: 6, border: "none", color: viewMode === "grid" ? "#fff" : "var(--text-muted)", cursor: "pointer" }}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{ padding: "6px 10px", background: viewMode === "list" ? "var(--brand-primary)" : "transparent", borderRadius: 6, border: "none", color: viewMode === "list" ? "#fff" : "var(--text-muted)", cursor: "pointer" }}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl flex flex-col items-center justify-center py-16" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", textAlign: "center" }}>
          <ImageIcon size={40} style={{ color: "var(--text-muted)", opacity: 0.4, marginBottom: 12 }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 16 }}>
            {search ? "No files match your search." : "No files uploaded yet."}
          </p>
          {!search && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
            >
              <Upload size={16} /> Upload First File
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((file) => {
            const color = getFileColor(file.mime_type);
            const isImage = file.mime_type?.startsWith("image/");
            return (
              <div
                key={file.id}
                className="group relative rounded-xl overflow-hidden cursor-pointer transition-all"
                style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", aspectRatio: "1" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--brand-primary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--admin-border)")}
              >
                {isImage ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" style={{ opacity: 0.8 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="flex items-center justify-center w-full h-full" style={{ background: `${color}15` }}>
                    {file.mime_type === "application/pdf" ? <FileText size={32} style={{ color }} /> : <ImageIcon size={32} style={{ color }} />}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: "var(--admin-card-bg)", borderTop: "1px solid var(--admin-border)" }}>
                  <p className="truncate" style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-primary)" }}>{file.name}</p>
                  <p style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{formatBytes(file.size_bytes)}</p>
                </div>
                {/* Hover actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => copyUrl(file.url)} style={{ width: 26, height: 26, background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }} title="Copy URL"><Copy size={12} /></button>
                  <button onClick={() => handleDelete(file)} style={{ width: 26, height: 26, background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--red)" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List view
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}>
          <div className="flex items-center gap-4 px-5 py-3" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--admin-border)" }}>
            {["Name", "Type", "Size", "Uploaded", "Actions"].map((h, i) => (
              <span key={h} style={{ flex: i === 0 ? 3 : 1, fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
            ))}
          </div>
          {filtered.map((file, i) => {
            const color = getFileColor(file.mime_type);
            return (
              <div key={file.id} className="flex items-center gap-4 px-5 py-3 transition-colors" style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--admin-border)" : "none" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--admin-hover)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <div style={{ flex: 3, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{ width: 28, height: 28, background: `${color}18`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ImageIcon size={14} style={{ color }} />
                  </div>
                  <p className="truncate" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{file.name}</p>
                </div>
                <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--text-muted)" }}>{file.mime_type?.split("/")[1]?.toUpperCase() ?? "—"}</span>
                <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--text-muted)" }}>{formatBytes(file.size_bytes)}</span>
                <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--text-muted)" }}>{new Date(file.created_at).toLocaleDateString()}</span>
                <div style={{ flex: 1, display: "flex", gap: 4 }}>
                  <button onClick={() => copyUrl(file.url)} style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }} title="Copy URL"><Copy size={13} /></button>
                  <button onClick={() => handleDelete(file)} style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", color: "var(--red)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }} title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
