"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/hooks/useToast";
import { Share2, Save, Loader2, Mail, Globe, Phone } from "lucide-react";

function GithubIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

interface PersonalInfo {
  id: string;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  email?: string | null;
}

interface SocialLink {
  key: keyof Omit<PersonalInfo, "id">;
  label: string;
  icon: React.ElementType;
  color: string;
  placeholder: string;
  prefix?: string;
}

const socialDefs: SocialLink[] = [
  { key: "github", label: "GitHub", icon: GithubIcon, color: "#6e7681", placeholder: "https://github.com/username" },
  { key: "linkedin", label: "LinkedIn", icon: LinkedinIcon, color: "#0A66C2", placeholder: "https://linkedin.com/in/username" },
  { key: "twitter", label: "X / Twitter", icon: TwitterIcon, color: "#1DA1F2", placeholder: "https://x.com/username" },
  { key: "email", label: "Email", icon: Mail, color: "#EA4335", placeholder: "your@email.com" },
];

export default function SocialLinksPage() {
  const [info, setInfo] = useState<PersonalInfo | null>(null);
  const [form, setForm] = useState<Omit<PersonalInfo, "id">>({
    github: "",
    linkedin: "",
    twitter: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchInfo = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("personal_info")
      .select("id,github,linkedin,twitter,email")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      toast.error("Failed to load social links: " + error.message);
    }
    if (data) {
      setInfo(data);
      setForm({
        github: data.github ?? "",
        linkedin: data.linkedin ?? "",
        twitter: data.twitter ?? "",
        email: data.email ?? "",
      });
    }
    setLoading(false);
  }, [supabase, toast]);

  useEffect(() => { fetchInfo(); }, [fetchInfo]);

  const handleSave = async () => {
    setSaving(true);
    if (info?.id) {
      const { error } = await supabase
        .from("personal_info")
        .update({
          github: form.github || null,
          linkedin: form.linkedin || null,
          twitter: form.twitter || null,
          email: form.email || null,
        })
        .eq("id", info.id);

      if (error) {
        toast.error("Failed to save: " + error.message);
      } else {
        toast.success("Social links updated successfully!");
        fetchInfo();
      }
    } else {
      // Insert if no personal_info row exists yet
      const { error } = await supabase.from("personal_info").insert({
        name: "Nilesh Kumar Singh",
        first_name: "Nilesh",
        role: "Full Stack Developer",
        tagline: "",
        bio: "",
        short_bio: "",
        email: form.email || "",
        github: form.github || null,
        linkedin: form.linkedin || null,
        twitter: form.twitter || null,
      });

      if (error) {
        toast.error("Failed to create profile: " + error.message);
      } else {
        toast.success("Social links saved!");
        fetchInfo();
      }
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
            Social Links
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
            Manage your social media links. Changes reflect on the public portfolio instantly.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg justify-center w-full sm:w-auto"
          style={{ padding: "10px 20px", background: "var(--brand-primary)", color: "#fff", border: "none", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Saving..." : "Save All Links"}
        </button>
      </div>

      {/* Links list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {socialDefs.map(({ key, label, icon: Icon, color, placeholder }) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl p-4 transition-all"
            style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)" }}
          >
            {/* Icon */}
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 44, height: 44, background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon size={20} style={{ color }} />
            </div>

            {/* Label */}
            <div style={{ width: 120, flexShrink: 0 }}>
              <p style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{label}</p>
            </div>

            {/* URL input */}
            <input
              type={key === "email" ? "email" : "url"}
              value={form[key] as string ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              className="flex-1 w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono,monospace)",
                fontSize: "0.8rem",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brand-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
            />

            {/* Status dot */}
            <div
              className="rounded-full flex-shrink-0"
              title={(form[key] as string)?.trim() ? "Active" : "Not set"}
              style={{
                width: 10,
                height: 10,
                background: (form[key] as string)?.trim() ? "#10B981" : "var(--bg-tertiary)",
                border: "1.5px solid var(--border-default)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Save bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg"
          style={{ padding: "10px 20px", background: "var(--brand-primary)", color: "#fff", border: "none", fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Saving..." : "Save All Links"}
        </button>
      </div>
    </div>
  );
}
