"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormModal } from "@/components/admin/FormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { useToast } from "@/lib/hooks/useToast";
import { Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillCategory {
  id: string;
  slug: string;
  label: string;
  icon: string;
  sort_order: number;
  skills: Skill[];
}

interface Skill {
  id: string;
  category_id: string;
  name: string;
  level: string;
  sort_order: number;
}

const levelColors: Record<string, string> = {
  beginner: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  expert: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [catModal, setCatModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ type: "category" | "skill"; id: string } | null>(null);
  const [editingCat, setEditingCat] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [catForm, setCatForm] = useState({ slug: "", label: "", icon: "Monitor", sort_order: 0 });
  const [skillForm, setSkillForm] = useState({ category_id: "", name: "", level: "intermediate", sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const { data: cats } = await supabase.from("skill_categories").select("*").order("sort_order");
    const { data: skills } = await supabase.from("skills").select("*").order("sort_order");

    const grouped = (cats ?? []).map((cat) => ({
      ...cat,
      skills: (skills ?? []).filter((s) => s.category_id === cat.id),
    }));
    setCategories(grouped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Category CRUD
  const openCreateCat = () => {
    setEditingCat(null);
    setCatForm({ slug: "", label: "", icon: "Monitor", sort_order: 0 });
    setCatModal(true);
  };

  const openEditCat = (cat: SkillCategory) => {
    setEditingCat(cat);
    setCatForm({ slug: cat.slug, label: cat.label, icon: cat.icon, sort_order: cat.sort_order });
    setCatModal(true);
  };

  const saveCat = async () => {
    setSaving(true);
    const payload = {
      ...catForm,
      slug: catForm.slug || catForm.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    };
    if (editingCat) {
      const { error } = await supabase.from("skill_categories").update(payload).eq("id", editingCat.id);
      if (error) {
        toast.error("Failed to update category: " + error.message);
      } else {
        toast.success("Category updated successfully!");
      }
    } else {
      const { error } = await supabase.from("skill_categories").insert(payload);
      if (error) {
        toast.error("Failed to create category: " + error.message);
      } else {
        toast.success("Category created successfully!");
      }
    }
    setSaving(false);
    setCatModal(false);
    fetchData();
  };

  // Skill CRUD
  const openCreateSkill = (categoryId: string) => {
    setEditingSkill(null);
    setSkillForm({ category_id: categoryId, name: "", level: "intermediate", sort_order: 0 });
    setSkillModal(true);
  };

  const openEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm({ category_id: skill.category_id, name: skill.name, level: skill.level, sort_order: skill.sort_order });
    setSkillModal(true);
  };

  const saveSkill = async () => {
    setSaving(true);
    if (editingSkill) {
      const { error } = await supabase.from("skills").update(skillForm).eq("id", editingSkill.id);
      if (error) {
        toast.error("Failed to update skill: " + error.message);
      } else {
        toast.success("Skill updated successfully!");
      }
    } else {
      const { error } = await supabase.from("skills").insert(skillForm);
      if (error) {
        toast.error("Failed to add skill: " + error.message);
      } else {
        toast.success("Skill added successfully!");
      }
    }
    setSaving(false);
    setSkillModal(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    if (deleteModal.type === "category") {
      const { error } = await supabase.from("skill_categories").delete().eq("id", deleteModal.id);
      if (error) {
        toast.error("Failed to delete category: " + error.message);
      } else {
        toast.success("Category deleted successfully!");
      }
    } else {
      const { error } = await supabase.from("skills").delete().eq("id", deleteModal.id);
      if (error) {
        toast.error("Failed to delete skill: " + error.message);
      } else {
        toast.success("Skill deleted successfully!");
      }
    }
    setDeleting(false);
    setDeleteModal(null);
    fetchData();
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
          <h2 className="text-xl font-bold text-white/90">Skills</h2>
          <p className="text-sm text-slate-500">{categories.length} categories · {categories.reduce((a, c) => a + c.skills.length, 0)} skills</p>
        </div>
        <button onClick={openCreateCat} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/25">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Category cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {/* Category header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <GripVertical size={14} className="text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-white/90">{cat.label}</h3>
                <span className="text-xs text-slate-600">{cat.skills.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openCreateSkill(cat.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Add skill">
                  <Plus size={14} />
                </button>
                <button onClick={() => openEditCat(cat)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleteModal({ type: "category", id: cat.id })} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Skills list */}
            <div className="p-3 space-y-1">
              {cat.skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm text-slate-300">{skill.name}</span>
                    <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border", levelColors[skill.level] || levelColors.intermediate)}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditSkill(skill)} className="p-1 rounded text-slate-500 hover:text-blue-400 transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => setDeleteModal({ type: "skill", id: skill.id })} className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {cat.skills.length === 0 && (
                <p className="text-xs text-slate-600 text-center py-4">No skills yet</p>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <p className="text-sm text-slate-500">No skill categories yet.</p>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <FormModal isOpen={catModal} onClose={() => setCatModal(false)} title={editingCat ? "Edit Category" : "Add Category"} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Label *</label>
            <input value={catForm.label} onChange={(e) => setCatForm({ ...catForm, label: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Icon (Lucide name)</label>
            <input value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} placeholder="Monitor, Server, Database..." className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button onClick={() => setCatModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors">Cancel</button>
            <button onClick={saveCat} disabled={saving || !catForm.label} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : editingCat ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </FormModal>

      {/* Skill Modal */}
      <FormModal isOpen={skillModal} onClose={() => setSkillModal(false)} title={editingSkill ? "Edit Skill" : "Add Skill"} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Name *</label>
            <input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Level</label>
            <select value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors">
              <option value="beginner" className="bg-[#12121a]">Beginner</option>
              <option value="intermediate" className="bg-[#12121a]">Intermediate</option>
              <option value="advanced" className="bg-[#12121a]">Advanced</option>
              <option value="expert" className="bg-[#12121a]">Expert</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button onClick={() => setSkillModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors">Cancel</button>
            <button onClick={saveSkill} disabled={saving || !skillForm.name} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : editingSkill ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={handleDelete} title={deleteModal?.type === "category" ? "Category" : "Skill"} loading={deleting} />
    </div>
  );
}
