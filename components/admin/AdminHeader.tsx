"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Calendar, Sun, Moon, User, Settings, LogOut, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

const pathLabels: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Welcome back, Nilesh! 👋",
    subtitle: "Here's what's happening with your portfolio.",
  },
  "/admin/projects": { title: "Projects", subtitle: "Manage your portfolio projects." },
  "/admin/experience": { title: "Experience", subtitle: "Manage your work experience." },
  "/admin/skills": { title: "Skills", subtitle: "Manage your skill set." },
  "/admin/achievements": { title: "Achievements", subtitle: "Manage your achievements." },
  "/admin/certifications": { title: "Certifications", subtitle: "Manage your certifications." },
  "/admin/resume": { title: "Resume", subtitle: "Manage your resume files." },
  "/admin/social-links": { title: "Social Links", subtitle: "Manage your social media links." },
  "/admin/contact-messages": { title: "Contact Messages", subtitle: "View and respond to messages." },
  "/admin/messages": { title: "Contact Messages", subtitle: "View and respond to messages." },
  "/admin/analytics": { title: "Analytics", subtitle: "View your portfolio analytics." },
  "/admin/seo": { title: "SEO Manager", subtitle: "Manage SEO settings." },
  "/admin/media": { title: "Media Library", subtitle: "Manage your media files." },
  "/admin/settings": { title: "Settings", subtitle: "Configure your portfolio settings." },
  "/admin/users": { title: "Users", subtitle: "Manage admin users." },
  "/admin/activity-logs": { title: "Activity Logs", subtitle: "View system activity logs." },
};

interface AdminHeaderProps {
  userEmail?: string;
  isMobile?: boolean;
  onMenuToggle?: () => void;
  onLogout?: () => void;
}

export function AdminHeader({ userEmail, isMobile, onMenuToggle, onLogout }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const info = pathLabels[pathname] || { title: "Admin Panel", subtitle: "Portfolio CMS" };
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Date range display (last 7 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  const fmtOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = startDate.toLocaleDateString("en-US", fmtOpts);
  const endStr = endDate.toLocaleDateString("en-US", { ...fmtOpts, year: "numeric" });

  const iconBtnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border-default)",
    borderRadius: 8,
    color: "var(--text-muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    flexShrink: 0,
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-7 border-b"
      style={{
        height: 60,
        background: "var(--admin-header-bg)",
        borderColor: "var(--admin-border)",
        transition: "background 0.22s ease, border-color 0.22s ease",
      }}
    >
      {/* ── Left: Page title + subtitle ── */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={onMenuToggle}
            title="Open menu"
            aria-label="Open menu"
            style={{
              width: 36,
              height: 36,
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-default)",
              borderRadius: 8,
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
          >
            <Menu size={18} />
          </button>
        )}
        <div>
          <h1
            style={{
              fontFamily: "var(--font-outfit, sans-serif)",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {info.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-outfit, sans-serif)",
              fontWeight: 400,
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            {info.subtitle}
          </p>
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-2.5">
        {/* Date range picker chip */}
        <button
          className="hidden sm:flex items-center gap-2 transition-colors"
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-default)",
            borderRadius: 8,
            padding: "7px 14px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-outfit, sans-serif)",
            fontWeight: 500,
            fontSize: "0.8rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Calendar size={14} style={{ color: "var(--text-muted)" }} />
          {startStr} – {endStr}
          <ChevronDown size={12} style={{ color: "var(--text-muted)" }} />
        </button>

        {/* Notification Bell */}
        <button
          className="relative"
          style={iconBtnStyle}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
          aria-label="Notifications"
        >
          <Bell size={17} />
          {/* Red dot badge */}
          <span
            className="absolute rounded-full"
            style={{
              width: 7,
              height: 7,
              background: "var(--red)",
              top: 7,
              right: 7,
            }}
          />
        </button>

        {/* Theme Toggle — Sun in dark mode / Moon in light mode */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          style={iconBtnStyle}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-tertiary)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Avatar Button */}
        <div className="relative">
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="flex items-center justify-center relative transition-all"
            style={{
              width: 36,
              height: 36,
              background: "#0F172A",
              border: "1px solid var(--border-strong)",
              borderRadius: 8,
              cursor: "pointer",
            }}
            aria-label="User menu"
          >
            <span
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: 900,
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              N
            </span>
            <span
              style={{
                position: "absolute",
                width: 6,
                height: 6,
                background: "#3B82F6",
                borderRadius: "50%",
                bottom: 3,
                right: 3,
              }}
            />
          </button>

          {avatarMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAvatarMenuOpen(false)}
              />
              <div
                className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden z-50"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-strong)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  minWidth: 200,
                }}
              >
                {userEmail && (
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid var(--border-default)" }}
                  >
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 400 }}>
                      Signed in as
                    </p>
                    <p
                      className="truncate"
                      style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600, maxWidth: 170 }}
                    >
                      {userEmail}
                    </p>
                  </div>
                )}
                {[
                  { icon: User, label: "Profile", action: () => { setAvatarMenuOpen(false); router.push("/admin/settings"); } },
                  { icon: Settings, label: "Settings", action: () => { setAvatarMenuOpen(false); router.push("/admin/settings"); } },
                ].map(({ icon: Icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors"
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-outfit, sans-serif)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--bg-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Icon size={15} style={{ color: "var(--text-muted)" }} />
                    {label}
                  </button>
                ))}
                <div style={{ borderTop: "1px solid var(--border-default)" }} />
                <button
                  onClick={() => { setAvatarMenuOpen(false); onLogout?.(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors"
                  style={{
                    color: "var(--red)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-outfit, sans-serif)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--red-pale)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
