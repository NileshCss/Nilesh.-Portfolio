"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormModal } from "@/components/admin/FormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { Plus, Pencil, Trash2, Award } from "lucide-react";

interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  year: string | null;
  sort_order: number;
}

const emptyAch: Omit<Achievement, "id"> = {
  slug: "", title: "", description: "", icon: "Award", year: "", sort_order: 0,
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState(emptyAch);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("achievements").select("*").order("sort_order");
    setAchievements(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyAch);
    setModalOpen(true);
  };

  const openEdit = (ach: Achievement) => {
    setEditing(ach);
    setForm({ ...ach });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      year: form.year || null,
    };
    if (editing) {
      await supabase.from("achievements").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("achievements").insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetch();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    await supabase.from("achievements").delete().eq("id", deleteModal);
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
          <h2 className="text-xl font-bold text-white/90">Achievements</h2>
          <p className="text-sm text-slate-500">{achievements.length} entries</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/25">
          <Plus size={16} /> Add Achievement
        </button>
      </div>

      {/* Achievement grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div key={ach.id} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Award size={18} className="text-blue-400" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(ach)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleteModal(ach.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white/90 mb-1">{ach.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">{ach.description}</p>
            {ach.year && (
              <span className="text-[10px] font-mono text-slate-600">{ach.year}</span>
            )}
          </div>
        ))}

        {achievements.length === 0 && (
          <div className="col-span-3 text-center py-16">
            <p className="text-sm text-slate-500">No achievements yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Achievement" : "Add Achievement"} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Icon (Lucide name)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Award, Trophy, Star..." className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Year</label>
              <input value={form.year ?? ""} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.title || !form.description} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={handleDelete} title="Achievement" loading={deleting} />
    </div>
  );
}
