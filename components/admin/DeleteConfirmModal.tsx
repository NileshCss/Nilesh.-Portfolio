"use client";

import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, loading }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#12121a] p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <h3 className="text-sm font-bold text-white/90">Delete {title}?</h3>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          This action cannot be undone. This will permanently delete this item.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
