"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormModal } from "@/components/admin/FormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { useToast } from "@/lib/hooks/useToast";
import { Plus, Pencil, Trash2, Building2, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Experience {
  id: string;
  slug: string;
  company: string;
  role: string;
  type: string;
  start_date: string;
  end_date: string;
  location: string | null;
  domain: string | null;
  responsibilities: string[];
  highlights: string[];
  sort_order: number;
}

const emptyExp: Omit<Experience, "id"> = {
  slug: "", company: "", role: "", type: "full-time",
  start_date: "", end_date: "Present", location: "", domain: "",
  responsibilities: [], highlights: [], sort_order: 0,
};

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(emptyExp);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [respText, setRespText] = useState("");
  const [highText, setHighText] = useState("");
  const supabase = createClient();
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("experiences").select("*").order("sort_order");
    setExperiences(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyExp);
    setRespText("");
    setHighText("");
    setModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({ ...exp });
    setRespText((exp.responsibilities ?? []).join("\n"));
    setHighText((exp.highlights ?? []).join("\n"));
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || form.company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      responsibilities: respText.split("\n").map((r) => r.trim()).filter(Boolean),
      highlights: highText.split("\n").map((h) => h.trim()).filter(Boolean),
      location: form.location || null,
      domain: form.domain || null,
    };

    if (editing) {
      const { error } = await supabase.from("experiences").update(payload).eq("id", editing.id);
      if (error) {
        toast.error("Failed to update experience: " + error.message);
      } else {
        toast.success("Experience updated successfully!");
      }
    } else {
      const { error } = await supabase.from("experiences").insert(payload);
      if (error) {
        toast.error("Failed to create experience: " + error.message);
      } else {
        toast.success("Experience created successfully!");
      }
    }

    setSaving(false);
    setModalOpen(false);
    fetch();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    const { error } = await supabase.from("experiences").delete().eq("id", deleteModal);
    if (error) {
      toast.error("Failed to delete experience: " + error.message);
    } else {
      toast.success("Experience deleted successfully!");
    }
    setDeleting(false);
    setDeleteModal(null);
    fetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white/90">Experience</h2>
          <p className="text-sm text-slate-500">{experiences.length} entries</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/25">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-all duration-200">
            {/* Timeline connector */}
            {index < experiences.length - 1 && (
              <div className="absolute left-[34px] top-[68px] bottom-[-16px] w-px bg-white/[0.06]" />
            )}

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex-shrink-0">
                <Building2 size={18} className="text-blue-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white/90">{exp.role}</h3>
                    <p className="text-sm text-slate-400">{exp.company}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {exp.start_date} — {exp.end_date}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {exp.location}
                        </span>
                      )}
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                        exp.type === "full-time" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                        exp.type === "freelance" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                        exp.type === "contract" && "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      )}>
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(exp)} className="p-2 rounded-lg text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setDeleteModal(exp.id)} className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {(exp.highlights ?? []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.highlights.map((h, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg text-[11px] text-slate-400 bg-white/[0.03] border border-white/[0.06]">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-slate-500">No experience entries yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Experience" : "Add Experience"} size="lg">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company *</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Role *</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors">
                <option value="full-time" className="bg-[#12121a]">Full-time</option>
                <option value="freelance" className="bg-[#12121a]">Freelance</option>
                <option value="contract" className="bg-[#12121a]">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Start Date *</label>
              <input value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} placeholder="Jun 2025" className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">End Date</label>
              <input value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} placeholder="Present" className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Location</label>
              <input value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Domain</label>
              <input value={form.domain ?? ""} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="Software Development" className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Responsibilities (one per line)</label>
            <textarea value={respText} onChange={(e) => setRespText(e.target.value)} rows={4} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Highlights (one per line)</label>
            <textarea value={highText} onChange={(e) => setHighText(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors resize-none" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.company || !form.role || !form.start_date} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={handleDelete} title="Experience" loading={deleting} />
    </div>
  );
}
