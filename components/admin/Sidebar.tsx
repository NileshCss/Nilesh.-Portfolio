"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Sparkles,
  Trophy,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Skills", href: "/admin/skills", icon: Sparkles },
  { label: "Achievements", href: "/admin/achievements", icon: Trophy },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  unreadCount?: number;
}

export function Sidebar({ collapsed, onToggle, onLogout, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r transition-all duration-300 ease-out",
        "bg-[#0c0c14]/95 backdrop-blur-xl border-white/[0.06]",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
        <Link href="/admin" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">N</span>
          </div>
          {!collapsed && (
            <span className="text-[0.95rem] font-bold text-white/90 truncate">
              Admin<span className="text-blue-400">.</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const showBadge = item.label === "Messages" && unreadCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full" />
              )}
              <Icon size={18} className={cn("flex-shrink-0", active && "text-blue-400")} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {showBadge && (
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold",
                    collapsed
                      ? "absolute top-1 right-1 w-4 h-4"
                      : "ml-auto min-w-5 h-5 px-1.5"
                  )}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <button
          onClick={onLogout}
          title={collapsed ? "Log out" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
