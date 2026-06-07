"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const pathLabels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/experience": "Experience",
  "/admin/skills": "Skills",
  "/admin/achievements": "Achievements",
  "/admin/messages": "Messages",
  "/admin/settings": "Settings",
};

interface AdminHeaderProps {
  userEmail?: string;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const pathname = usePathname();
  const pageTitle = pathLabels[pathname] || "Admin";

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 md:px-8 border-b border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-xl">
      {/* Left — Page title */}
      <div>
        <h1 className="text-lg font-bold text-white/90">{pageTitle}</h1>
        <p className="text-xs text-slate-500 font-mono">
          /admin{pathname === "/admin" ? "" : pathname.replace("/admin", "")}
        </p>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors">
          <Bell size={18} />
        </button>

        {userEmail && (
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {userEmail[0].toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-slate-400 max-w-[160px] truncate">
              {userEmail}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
