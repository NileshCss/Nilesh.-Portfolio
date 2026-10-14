"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormModal } from "@/components/admin/FormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { useToast } from "@/lib/hooks/useToast";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Upload,
  Loader2,
  X,
  Eye,
  EyeOff,
  Building2,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────

interface AdminExperience {
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
  technology_tags: string[];
  company_logo_url: string | null;
  company_logo_storage_path: string | null;
  is_visible: boolean;
  sort_order: number;
}

const emptyExp: Omit<AdminExperience, "id"> = {
  slug: "",
  company: "",
  role: "",
  type: "full-time",
  start_date: "",
  end_date: "",
  location: "",
  domain: "",
  responsibilities: [],
  highlights: [],
  technology_tags: [],
  company_logo_url: null,
  company_logo_storage_path: null,
  is_visible: true,
  sort_order: 0,
};

// ── Logo placeholder (initials) ───────────────────────────────────────────

function InitialsAvatar({ company }: { company: string }) {
  const initials = company
    .split(/[\s&.,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm select-none"
      style={{
        background: "var(--brand-pale)",
        color: "var(--brand-primary)",
        border: "1px solid var(--border-default)",
      }}
    >
      {initials || <Building2 size={16} />}
    </div>
  );
}

// ── Logo preview with remove ───────────────────────────────────────────────

function LogoPreview({
  url,
  company,
  onRemove,
}: {
  url: string;
  company: string;
  onRemove: () => void;
}) {
  const [error, setError] = useState(false);

  return (
    <div
      className="flex items-center gap-3 p-2 rounded-lg"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-default)",
      }}
    >
      {error ? (
        <InitialsAvatar company={company} />
      ) : (
        <img
          src={url}
          alt={`${company} logo preview`}
          className="w-10 h-10 object-contain rounded-xl"
          style={{ border: "1px solid var(--border-default)" }}
          onError={() => setError(true)}
        />
      )}
      <span
        className="text-xs truncate flex-1"
        style={{ color: "var(--text-muted)" }}
        title={url}
      >
        {url.split("/").pop()}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 rounded-md text-xs transition-colors"
        style={{ background: "rgba(239,68,68,0.1)", color: "#F87171" }}
        aria-label="Remove logo"
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ── Main admin page ────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminExperience | null>(null);
  const [form, setForm] = useState<Omit<AdminExperience, "id">>(emptyExp);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [respText, setRespText] = useState("");
  const [highText, setHighText] = useState("");
  const [tagsText, setTagsText] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { toast } = useToast();

  // ── Fetch ─────────────────────────────────────────────────────────────
  const fetchExperiences = useCallback(async () => {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });
    setExperiences((data as AdminExperience[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // ── Logo upload ───────────────────────────────────────────────────────
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file must be under 2MB.");
      return;
    }

    setLogoUploading(true);
    try {
      // Generate versioned path to avoid cache issues
      const ext = file.name.split(".").pop() ?? "png";
      const companySlug =
        form.company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ||
        "company";
      const storagePath = `logos/${companySlug}-${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("experience-logos")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        toast.error("Logo upload failed: " + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("experience-logos")
        .getPublicUrl(uploadData.path);

      // If replacing, attempt to clean up old logo
      if (form.company_logo_storage_path) {
        await supabase.storage
          .from("experience-logos")
          .remove([form.company_logo_storage_path]);
      }

      setForm((prev) => ({
        ...prev,
        company_logo_url: urlData.publicUrl,
        company_logo_storage_path: uploadData.path,
      }));
      toast.success("Logo uploaded successfully!");
    } catch {
      toast.error("Logo upload failed. Please try again.");
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = async () => {
    if (form.company_logo_storage_path) {
      await supabase.storage
        .from("experience-logos")
        .remove([form.company_logo_storage_path]);
    }
    setForm((prev) => ({
      ...prev,
      company_logo_url: null,
      company_logo_storage_path: null,
    }));
  };

  // ── Modal helpers ────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyExp, sort_order: experiences.length });
    setRespText("");
    setHighText("");
    setTagsText("");
    setModalOpen(true);
  };

  const openEdit = (exp: AdminExperience) => {
    setEditing(exp);
    setForm({
      slug: exp.slug,
      company: exp.company,
      role: exp.role,
      type: exp.type,
      start_date: exp.start_date,
      end_date: exp.end_date,
      location: exp.location,
      domain: exp.domain,
      responsibilities: exp.responsibilities,
      highlights: exp.highlights,
      technology_tags: exp.technology_tags ?? [],
      company_logo_url: exp.company_logo_url,
      company_logo_storage_path: exp.company_logo_storage_path,
      is_visible: exp.is_visible ?? true,
      sort_order: exp.sort_order,
    });
    setRespText((exp.responsibilities ?? []).join("\n"));
    setHighText((exp.highlights ?? []).join("\n"));
    setTagsText((exp.technology_tags ?? []).join(", "));
    setModalOpen(true);
  };

  // ── Save ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.company.trim() || !form.role.trim() || !form.start_date.trim()) {
      toast.error("Company, role, and start date are required.");
      return;
    }

    if (
      form.end_date &&
      form.end_date !== "Present" &&
      form.start_date &&
      form.start_date > form.end_date
    ) {
      toast.error("End date cannot be before start date.");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      slug:
        form.slug ||
        form.company
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      responsibilities: respText
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      highlights: highText
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
      technology_tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      location: form.location || null,
      domain: form.domain || null,
      end_date: form.end_date || "Present",
    };

    let error;
    if (editing) {
      ({ error } = await supabase
        .from("experiences")
        .update(payload)
        .eq("id", editing.id));
      if (!error) toast.success("Experience updated successfully!");
    } else {
      ({ error } = await supabase.from("experiences").insert(payload));
      if (!error) toast.success("Experience created successfully!");
    }

    if (error) toast.error("Save failed: " + error.message);

    setSaving(false);
    setModalOpen(false);
    fetchExperiences();
  };

  // ── Delete ────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);

    const target = experiences.find((e) => e.id === deleteModal);
    // Remove logo from storage if present
    if (target?.company_logo_storage_path) {
      await supabase.storage
        .from("experience-logos")
        .remove([target.company_logo_storage_path]);
    }

    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", deleteModal);
    if (error) {
      toast.error("Delete failed: " + error.message);
    } else {
      toast.success("Experience deleted.");
    }

    setDeleting(false);
    setDeleteModal(null);
    fetchExperiences();
  };

  // ── Toggle visibility ─────────────────────────────────────────────────
  const toggleVisibility = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("experiences")
      .update({ is_visible: !current })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update visibility: " + error.message);
    } else {
      toast.success(current ? "Experience hidden." : "Experience published.");
    }
    fetchExperiences();
  };

  // ── Reorder ───────────────────────────────────────────────────────────
  const moveEntry = async (id: string, direction: "up" | "down") => {
    const idx = experiences.findIndex((e) => e.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === experiences.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const current = experiences[idx];
    const swap = experiences[swapIdx];

    // Swap sort_order values
    await Promise.all([
      supabase
        .from("experiences")
        .update({ sort_order: swap.sort_order })
        .eq("id", current.id),
      supabase
        .from("experiences")
        .update({ sort_order: current.sort_order })
        .eq("id", swap.id),
    ]);

    fetchExperiences();
  };

  // ── Render ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors placeholder:opacity-40";
  const inputStyle = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-default)",
    color: "var(--text-primary)",
  };
  const labelCls =
    "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "var(--text-muted)" };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Experience
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {experiences.length} {experiences.length === 1 ? "entry" : "entries"}
            {" · "}
            {experiences.filter((e) => e.is_visible).length} visible
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
          style={{ background: "var(--brand-primary)" }}
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {/* ── Experience list ─────────────────────────────────────────── */}
      <div className="space-y-3">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="group rounded-2xl p-5 transition-all duration-200"
            style={{
              background: "var(--admin-card-bg)",
              border: `1px solid ${exp.is_visible ? "var(--admin-border)" : "var(--border-default)"}`,
              opacity: exp.is_visible ? 1 : 0.65,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--brand-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = exp.is_visible
                ? "var(--admin-border)"
                : "var(--border-default)")
            }
          >
            <div className="flex items-start gap-4">
              {/* Logo / Initials */}
              {exp.company_logo_url ? (
                <img
                  src={exp.company_logo_url}
                  alt={`${exp.company} logo`}
                  className="w-10 h-10 rounded-xl object-contain shrink-0"
                  style={{ border: "1px solid var(--border-default)" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <InitialsAvatar company={exp.company} />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  {/* Info */}
                  <div className="min-w-0">
                    <h3
                      className="text-base font-bold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {exp.role}
                    </h3>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {exp.company}
                    </p>
                    <div
                      className="flex flex-wrap items-center gap-3 mt-2 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {exp.start_date} — {exp.end_date || "Present"}
                      </span>
                      {exp.domain && (
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                          style={{
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border-default)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {exp.domain}
                        </span>
                      )}
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          exp.type === "full-time" &&
                            "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                          exp.type === "freelance" &&
                            "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                          exp.type === "contract" &&
                            "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        )}
                      >
                        {exp.type}
                      </span>
                      {!exp.is_visible && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
                          Hidden
                        </span>
                      )}
                    </div>

                    {/* Technology tags preview */}
                    {(exp.technology_tags ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {(exp.technology_tags ?? []).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                            style={{
                              color: "var(--brand-primary)",
                              background: "var(--bg-secondary)",
                              border: "1px solid var(--border-default)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Reorder */}
                    <button
                      onClick={() => moveEntry(exp.id, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                      style={{ color: "var(--text-muted)" }}
                      title="Move up"
                      aria-label="Move experience up"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      onClick={() => moveEntry(exp.id, "down")}
                      disabled={index === experiences.length - 1}
                      className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                      style={{ color: "var(--text-muted)" }}
                      title="Move down"
                      aria-label="Move experience down"
                    >
                      <ChevronDown size={15} />
                    </button>

                    {/* Visibility toggle */}
                    <button
                      onClick={() => toggleVisibility(exp.id, exp.is_visible)}
                      title={exp.is_visible ? "Hide from public" : "Publish"}
                      aria-label={exp.is_visible ? "Hide experience" : "Publish experience"}
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        color: exp.is_visible ? "var(--brand-primary)" : "var(--text-muted)",
                      }}
                    >
                      {exp.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(exp)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--brand-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                      aria-label="Edit experience"
                    >
                      <Pencil size={15} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteModal(exp.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#F87171")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                      aria-label="Delete experience"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed var(--border-default)" }}>
            <Building2 size={32} className="mx-auto mb-3 opacity-30" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No experience entries yet. Add your first entry!
            </p>
          </div>
        )}
      </div>

      {/* ── Create/Edit Modal ─────────────────────────────────────────── */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Experience" : "Add Experience"}
        size="lg"
      >
        <div className="space-y-4">
          {/* Company + Role */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>
                Company *
              </label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="ReSource Pro"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>
                Role / Job Title *
              </label>
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Associate Service Delivery"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Type + Start + End */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>
                Employment Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputCls}
                style={inputStyle}
              >
                <option value="full-time">Full-time</option>
                <option value="freelance">Freelance</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>
                Start Date *
              </label>
              <input
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
                placeholder="Jun 2025"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>
                End Date
              </label>
              <input
                value={form.end_date}
                onChange={(e) =>
                  setForm({ ...form, end_date: e.target.value })
                }
                placeholder="Aug 2026 or Present"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Domain + Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>
                Business Domain
              </label>
              <input
                value={form.domain ?? ""}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="US Property & Casualty Insurance"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>
                Location
              </label>
              <input
                value={form.location ?? ""}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                placeholder="Remote"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Company Logo Upload */}
          <div>
            <label className={labelCls} style={labelStyle}>
              Company Logo
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="file"
                ref={logoInputRef}
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleLogoUpload}
                aria-label="Upload company logo"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                }}
              >
                {logoUploading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
                {form.company_logo_url ? "Replace Logo" : "Upload Logo"}
              </button>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                PNG, JPG, SVG, WebP · Max 2MB
              </span>
            </div>

            {form.company_logo_url && (
              <div className="mt-2">
                <LogoPreview
                  url={form.company_logo_url}
                  company={form.company}
                  onRemove={handleRemoveLogo}
                />
              </div>
            )}
          </div>

          {/* Responsibilities */}
          <div>
            <label className={labelCls} style={labelStyle}>
              Responsibilities{" "}
              <span className="normal-case font-normal">(one per line)</span>
            </label>
            <textarea
              value={respText}
              onChange={(e) => setRespText(e.target.value)}
              rows={5}
              placeholder={`Supported US P&C insurance operations.\nWorked on SLB project and documentation workflows.`}
              className={cn(inputCls, "resize-none")}
              style={inputStyle}
            />
          </div>

          {/* Key Contributions / Highlights */}
          <div>
            <label className={labelCls} style={labelStyle}>
              Key Contributions{" "}
              <span className="normal-case font-normal">(one per line)</span>
            </label>
            <textarea
              value={highText}
              onChange={(e) => setHighText(e.target.value)}
              rows={3}
              placeholder={`Documentation Accuracy\nQuality Assurance\nClient Workflow Support`}
              className={cn(inputCls, "resize-none")}
              style={inputStyle}
            />
          </div>

          {/* Technology / Domain Tags */}
          <div>
            <label className={labelCls} style={labelStyle}>
              Domain & Tool Tags{" "}
              <span className="normal-case font-normal">(comma separated)</span>
            </label>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="Insurance Operations, AMS, OnBase, Policy Documentation"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {/* Visibility toggle */}
          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) =>
                  setForm({ ...form, is_visible: e.target.checked })
                }
                className="w-4 h-4 rounded border accent-blue-500"
              />
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                Visible on public portfolio
              </span>
            </label>
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-end gap-3 pt-4 border-t"
            style={{ borderColor: "var(--border-default)" }}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.company || !form.role || !form.start_date}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-colors"
              style={{ background: "var(--brand-primary)" }}
            >
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Experience"
        loading={deleting}
      />
    </div>
  );
}
