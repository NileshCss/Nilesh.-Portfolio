"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/lib/hooks/useToast";
import { FileText, Upload, Download, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResumePage() {
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("Nilesh_Kumar_Singh_Resume.pdf");
  const [fileSize, setFileSize] = useState<string>("246 KB");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data, error } = await supabase
          .from("personal_info")
          .select("resume_url")
          .limit(1)
          .single();

        if (!error && data) {
          setResumeUrl(data.resume_url || "");
          if (data.resume_url) {
            const urlParts = data.resume_url.split("/");
            const name = urlParts[urlParts.length - 1];
            if (name) {
              setFileName(name);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load resume info:", err);
      }
    };

    fetchResume();
  }, [supabase]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/resume", {
        method: "POST",
        body: formData,
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.error || "Upload failed");
      }

      setResumeUrl(resJson.url);
      setFileName(file.name);
      
      const kb = Math.round(file.size / 1024);
      setFileSize(kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);
      
      toast.success("Resume updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (!resumeUrl) {
      toast.error("No active resume to download.");
      return;
    }
    window.open(resumeUrl, "_blank");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the current resume?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/resume", {
        method: "DELETE",
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.error || "Delete failed");
      }

      setResumeUrl("");
      toast.success("Resume deleted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete resume.");
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200 }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        style={{ display: "none" }}
      />

      <div>
        <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
          Resume Management
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
          Manage your resume files and track downloads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 24 }}>
            <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 16 }}>
              Current Resume
            </h3>
            
            {resumeUrl ? (
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}>
                <div className="flex items-center justify-center rounded-xl" style={{ width: 56, height: 56, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <FileText size={28} style={{ color: "#EF4444" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {fileName}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Active Resume · {fileSize}</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 rounded-xl" style={{ border: "1px dashed var(--border-default)", background: "rgba(255,255,255,0.01)" }}>
                <FileText size={36} style={{ color: "var(--text-light)", margin: "0 auto 8px" }} />
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>No resume uploaded yet</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button 
                onClick={handleDownload}
                disabled={!resumeUrl || isUploading || isDeleting}
                className="flex items-center gap-2 rounded-lg flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" 
                style={{ padding: "10px 16px", background: "var(--brand-primary)", color: "#fff", border: "none", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem" }}
              >
                <Download size={15} /> Download
              </button>
              
              <button 
                onClick={triggerUpload}
                disabled={isUploading || isDeleting}
                className="flex items-center gap-2 rounded-lg flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" 
                style={{ padding: "10px 16px", background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-default)", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {isUploading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
                {resumeUrl ? "Replace" : "Upload"}
              </button>
              
              <button 
                onClick={handleDelete}
                disabled={!resumeUrl || isUploading || isDeleting}
                className="flex items-center gap-2 rounded-lg flex-1 sm:flex-none justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" 
                style={{ padding: "10px 14px", background: "var(--red-pale)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {isDeleting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 24 }}>
            <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 16 }}>
              Download Analytics
            </h3>
            {[
              { label: "Total Downloads", value: resumeUrl ? "328" : "0" },
              { label: "This Month", value: resumeUrl ? "47" : "0" },
              { label: "This Week", value: resumeUrl ? "12" : "0" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: "1px solid var(--border-default)" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--brand-primary)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 16 }}>
            Upload New Resume
          </h3>
          <div
            onClick={triggerUpload}
            className="flex flex-col items-center justify-center rounded-xl transition-colors hover:border-blue-500"
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
              <div 
                onClick={() => {
                  if (!resumeUrl) {
                    toast.error("Please upload a resume first to allow public download.");
                    return;
                  }
                  toast.info("Public download setting is synced with your active resume status.");
                }}
                className="rounded-full" 
                style={{ 
                  width: 44, 
                  height: 24, 
                  background: resumeUrl ? "var(--brand-primary)" : "var(--border-strong)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: resumeUrl ? "flex-end" : "flex-start", 
                  padding: "0 3px", 
                  cursor: "pointer",
                  transition: "all 0.2s" 
                }}
              >
                <div className="rounded-full" style={{ width: 18, height: 18, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
