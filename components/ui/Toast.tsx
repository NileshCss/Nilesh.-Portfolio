"use client";

import { useToast, ToastMessage } from "@/lib/hooks/useToast";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

function ToastItem({ toast }: { toast: ToastMessage }) {
  const { removeToast } = useToast();

  const styles = {
    success: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300",
    error: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-500/30 text-red-800 dark:text-red-300",
    warning: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-500/30 text-amber-800 dark:text-amber-300",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-500/30 text-blue-800 dark:text-blue-300",
  };

  const icons = {
    success: <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle size={16} className="text-red-500 flex-shrink-0" />,
    warning: <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />,
    info: <Info size={16} className="text-blue-500 flex-shrink-0" />,
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border shadow-2xl w-[420px] max-w-[92vw]",
        styles[toast.type]
      )}
      style={{
        fontFamily: "var(--font-outfit, sans-serif)",
        fontSize: "0.9rem",
        fontWeight: 500,
        padding: "14px 18px",
        animation: "toastSlideDown 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{icons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-current/60 hover:text-current transition-colors cursor-pointer ml-1"
      >
        <X size={15} />
      </button>
      <style>{`
        @keyframes toastSlideDown {
          from { opacity: 0; transform: translateY(-24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-[9999] flex flex-col items-center gap-3 pointer-events-none"
      style={{ top: 28, left: "50%", transform: "translateX(-50%)" }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
