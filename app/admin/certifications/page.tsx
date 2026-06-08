"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormModal } from "@/components/admin/FormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { useToast } from "@/lib/hooks/useToast";
import { Award, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

interface Certification {
  id: string;
  slug: string;
  title: string;
  issuer: string;
  date: string;
  expiry_date?: string | null;
  credential_url?: string | null;
  credential_id?: string | null;
  sort_order: number;
}

const emptyCert: Omit<Certification, "id"> = {
  slug: "",
  title: "",
  issuer: "",
  date: "",
  expiry_date: "",
  credential_url: "",
  credential_id: "",
  sort_order: 0,
};

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState(emptyCert);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchCerts = useCallback(async () => {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error && error.code !== "42P01") {
      // 42P01 = table doesn't exist, ignore gracefully
      toast.error("Failed to load certifications: " + error.message);
    }
    setCerts(data ?? []);
    setLoading(false);
  }, [supabase, toast]);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCert);
    setModalOpen(true);
  };

  const openEdit = (cert: Certification) => {
    setEditing(cert);
    setForm({ ...cert });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      expiry_date: form.expiry_date || null,
      credential_url: form.credential_url || null,
      credential_id: form.credential_id || null,
    };

    if (editing) {
      const { error } = await supabase.from("certifications").update(payload).eq("id", editing.id);
      if (error) toast.error("Failed to update: " + error.message);
      else toast.success("Certification updated!");
    } else {
      const { error } = await supabase.from("certifications").insert(payload);
      if (error) toast.error("Failed to create: " + error.message);
      else toast.success("Certification added!");
    }

    setSaving(false);
    setModalOpen(false);
    fetchCerts();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    const { error } = await supabase.from("certifications").delete().eq("id", deleteModal);
    if (error) toast.error("Failed to delete: " + error.message);
    else toast.success("Certification deleted!");
    setDeleting(false);
    setDeleteModal(null);
    fetchCerts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
            Certifications
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
            {certs.length} certification{certs.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/25"
        >
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Award size={18} className="text-blue-400" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="View credential"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  onClick={() => openEdit(cert)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteModal(cert.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white/90 mb-1">{cert.title}</h3>
            <p className="text-xs text-slate-400 mb-2">{cert.issuer}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-slate-600">{cert.date}</span>
              {cert.expiry_date && (
                <span className="text-[10px] text-slate-600">→ {cert.expiry_date}</span>
              )}
              {cert.credential_id && (
                <span className="text-[10px] font-mono text-slate-600 truncate">ID: {cert.credential_id}</span>
              )}
            </div>
          </div>
        ))}

        {certs.length === 0 && (
          <div className="col-span-full rounded-xl flex flex-col items-center justify-center" style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-border)", padding: "80px 40px", textAlign: "center" }}>
            <div className="flex items-center justify-center rounded-full mb-5" style={{ width: 72, height: 72, background: "rgba(37,99,235,0.1)" }}>
              <Award size={32} style={{ color: "var(--brand-primary)" }} />
            </div>
            <h3 style={{ fontFamily: "var(--font-outfit,sans-serif)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 8 }}>
              No certifications yet
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", maxWidth: 360, marginBottom: 20 }}>
              Add your professional certifications from cloud providers, universities, and other issuers.
            </p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
            >
              <Plus size={16} /> Add First Certification
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Certification" : "Add Certification"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="AWS Certified Solutions Architect"
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Issuer *</label>
            <input
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              placeholder="Amazon Web Services"
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Issue Date *</label>
              <input
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="Jan 2024"
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
              <input
                value={form.expiry_date ?? ""}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                placeholder="Jan 2027 (or leave blank)"
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Credential ID</label>
            <input
              value={form.credential_id ?? ""}
              onChange={(e) => setForm({ ...form, credential_id: e.target.value })}
              placeholder="ABC-123-XYZ"
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Credential URL</label>
            <input
              value={form.credential_url ?? ""}
              onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
              placeholder="https://verify.example.com/cert/abc"
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.issuer || !form.date}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors"
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
        title="Certification"
        loading={deleting}
      />
    </div>
  );
}
