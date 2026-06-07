"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, User, Globe, FileText, CheckCircle2 } from "lucide-react";

interface PersonalInfo {
  id: string;
  name: string;
  first_name: string;
  role: string;
  tagline: string;
  bio: string;
  short_bio: string;
  email: string;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  location: string | null;
  resume_url: string | null;
  open_to_work: boolean;
}

export default function SettingsPage() {
  const [info, setInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  const fetchInfo = useCallback(async () => {
    const { data } = await supabase.from("personal_info").select("*").limit(1).single();
    setInfo(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchInfo(); }, [fetchInfo]);

  const handleSave = async () => {
    if (!info) return;
    setSaving(true);
    setSaved(false);

    const { id, ...payload } = info;
    await supabase.from("personal_info").update(payload).eq("id", id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const update = (field: keyof PersonalInfo, value: string | boolean) => {
    if (!info) return;
    setInfo({ ...info, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!info) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500 mb-4">No personal info found. Create your profile first.</p>
        <button
          onClick={async () => {
            await supabase.from("personal_info").insert({
              name: "Nilesh Kumar Singh",
              first_name: "Nilesh",
              role: "Full Stack Java Developer",
              tagline: "Building scalable web applications",
              bio: "",
              short_bio: "",
              email: "rajputnileshsingh25@gmail.com",
              open_to_work: true,
            });
            fetchInfo();
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white/90">Settings</h2>
          <p className="text-sm text-slate-500">Manage your personal information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/25"
        >
          {saved ? (
            <>
              <CheckCircle2 size={16} className="text-emerald-300" /> Saved!
            </>
          ) : saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* Personal Info Section */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
          <User size={16} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white/90">Personal Info</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input value={info.name} onChange={(e) => update("name", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">First Name</label>
              <input value={info.first_name} onChange={(e) => update("first_name", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Role / Title</label>
            <input value={info.role} onChange={(e) => update("role", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tagline</label>
            <input value={info.tagline} onChange={(e) => update("tagline", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Bio</label>
            <textarea value={info.bio} onChange={(e) => update("bio", e.target.value)} rows={5} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Short Bio</label>
            <input value={info.short_bio} onChange={(e) => update("short_bio", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
              <input value={info.email} onChange={(e) => update("email", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Location</label>
              <input value={info.location ?? ""} onChange={(e) => update("location", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          </div>

          {/* Open to Work Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <p className="text-sm font-semibold text-white/90">Open to Work</p>
              <p className="text-xs text-slate-500 mt-0.5">Show availability badge on your portfolio</p>
            </div>
            <button
              onClick={() => update("open_to_work", !info.open_to_work)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${info.open_to_work ? "bg-blue-600" : "bg-white/[0.1]"}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${info.open_to_work ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
          <Globe size={16} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white/90">Social Links</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">GitHub URL</label>
            <input value={info.github ?? ""} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/..." className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">LinkedIn URL</label>
            <input value={info.linkedin ?? ""} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Twitter / X URL</label>
            <input value={info.twitter ?? ""} onChange={(e) => update("twitter", e.target.value)} placeholder="https://x.com/..." className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
          <FileText size={16} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white/90">Resume</h3>
        </div>
        <div className="p-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Resume URL</label>
            <input value={info.resume_url ?? ""} onChange={(e) => update("resume_url", e.target.value)} placeholder="/resume.pdf" className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
            <p className="text-xs text-slate-600 mt-1.5">Path or URL to your resume file</p>
          </div>
        </div>
      </div>
    </div>
  );
}
