"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormModal } from "@/components/admin/FormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { useToast } from "@/lib/hooks/useToast";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  Search,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  tech_stack: string[];
  category: string;
  status: string;
  github_url: string | null;
  live_url: string | null;
  is_featured: boolean;
  business_impact: string | null;
  challenge: string | null;
  sort_order: number;
}

const emptyProject: Omit<Project, "id"> = {
  slug: "",
  title: "",
  tagline: "",
  description: "",
  features: [],
  tech_stack: [],
  category: "",
  status: "completed",
  github_url: "",
  live_url: "",
  is_featured: false,
  business_impact: "",
  challenge: "",
  sort_order: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [featuresText, setFeaturesText] = useState("");
  const [techText, setTechText] = useState("");
  const supabase = createClient();
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    setProjects(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject);
    setFeaturesText("");
    setTechText("");
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({ ...project });
    setFeaturesText((project.features ?? []).join("\n"));
    setTechText((project.tech_stack ?? []).join(", "));
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
      tech_stack: techText.split(",").map((t) => t.trim()).filter(Boolean),
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      business_impact: form.business_impact || null,
      challenge: form.challenge || null,
    };

    if (editing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
      if (error) {
        toast.error("Failed to update project: " + error.message);
      } else {
        toast.success("Project updated successfully!");
      }
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) {
        toast.error("Failed to create project: " + error.message);
      } else {
        toast.success("Project created successfully!");
      }
    }

    setSaving(false);
    setModalOpen(false);
    fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    const { error } = await supabase.from("projects").delete().eq("id", deleteModal);
    if (error) {
      toast.error("Failed to delete project: " + error.message);
    } else {
      toast.success("Project deleted successfully!");
    }
    setDeleting(false);
    setDeleteModal(null);
    fetchProjects();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from("projects").update({ is_featured: !current }).eq("id", id);
    if (error) {
      toast.error("Failed to update featured status: " + error.message);
    } else {
      toast.success(`Project ${!current ? "featured" : "unfeatured"} successfully!`);
    }
    fetchProjects();
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white/90">Projects</h2>
          <p className="text-sm text-slate-500">{projects.length} projects total</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/25"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>

      {/* Project cards */}
      <div className="grid gap-4">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-bold text-white/90">{project.title}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    project.status === "live" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                    project.status === "completed" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                    project.status === "development" && "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  )}>
                    {project.status}
                  </span>
                  {project.is_featured && (
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-3">{project.tagline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(project.tech_stack ?? []).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-medium text-blue-400 bg-blue-500/10 border border-blue-500/15"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleFeatured(project.id, project.is_featured)}
                  title="Toggle featured"
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    project.is_featured
                      ? "text-amber-400 hover:bg-amber-500/10"
                      : "text-slate-600 hover:text-slate-400 hover:bg-white/[0.04]"
                  )}
                >
                  <Star size={16} className={project.is_featured ? "fill-current" : ""} />
                </button>
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <GithubIcon size={16} />
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => openEdit(project)}
                  className="p-2 rounded-lg text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleteModal(project.id)}
                  className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-slate-500">
              {search ? "No projects match your search." : "No projects yet. Add your first project!"}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Project" : "Add Project"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated"
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tagline *</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category *</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="SaaS Platform, E-commerce..."
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="completed" className="bg-[#12121a]">Completed</option>
                <option value="live" className="bg-[#12121a]">Live</option>
                <option value="development" className="bg-[#12121a]">In Development</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tech Stack (comma separated)</label>
            <input
              value={techText}
              onChange={(e) => setTechText(e.target.value)}
              placeholder="React, Node.js, MongoDB"
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Features (one per line)</label>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              rows={3}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">GitHub URL</label>
              <input
                value={form.github_url ?? ""}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Live URL</label>
              <input
                value={form.live_url ?? ""}
                onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Business Impact</label>
            <textarea
              value={form.business_impact ?? ""}
              onChange={(e) => setForm({ ...form, business_impact: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Challenge</label>
            <textarea
              value={form.challenge ?? ""}
              onChange={(e) => setForm({ ...form, challenge: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/[0.04] text-blue-600 focus:ring-blue-500/30"
              />
              <span className="text-sm text-slate-300">Featured project</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.tagline || !form.description}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </FormModal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Project"
        loading={deleting}
      />
    </div>
  );
}
