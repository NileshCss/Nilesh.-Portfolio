"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  Mail,
  CheckCheck,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import type { AdminNotification } from "@/app/admin/AdminLayoutClient";

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
  unreadCount?: number;
  notifications?: AdminNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export function AdminHeader({
  userEmail,
  isMobile,
  onMenuToggle,
  onLogout,
  unreadCount = 0,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllRead,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const info = pathLabels[pathname] || { title: "Admin Panel", subtitle: "Portfolio CMS" };
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const bellRef = useRef<HTMLDivElement>(null);

  // Close bell dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const handleBellClick = () => {
    setBellOpen((prev) => !prev);
    setAvatarMenuOpen(false);
  };

  const handleNotificationClick = (notif: AdminNotification) => {
    if (!notif.is_read) {
      onMarkNotificationRead?.(notif.id);
    }
    setBellOpen(false);
    router.push("/admin/contact-messages");
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
        {/* Date range chip */}
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

        {/* ── Notification Bell ── */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={handleBellClick}
            className="relative"
            style={iconBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
            aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
            title="Notifications"
          >
            <Bell size={17} />
            {/* Count badge — only shows when there are unread */}
            {unreadCount > 0 && (
              <span
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  minWidth: unreadCount > 9 ? 16 : 14,
                  height: unreadCount > 9 ? 16 : 14,
                  background: "#EF4444",
                  color: "#fff",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  top: -4,
                  right: -4,
                  lineHeight: 1,
                  padding: "0 3px",
                  boxShadow: "0 0 0 2px var(--admin-header-bg)",
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            {/* Static red dot when count == 0 but we want to show activity */}
            {unreadCount === 0 && (
              <span
                className="absolute rounded-full"
                style={{
                  width: 7,
                  height: 7,
                  background: "var(--red, #EF4444)",
                  top: 7,
                  right: 7,
                  opacity: 0.6,
                }}
              />
            )}
          </button>

          {/* ── Notification Dropdown ── */}
          {bellOpen && (
            <>
              {/* Invisible backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setBellOpen(false)}
              />
              <div
                className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden z-50 flex flex-col"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-strong)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                  width: 340,
                  maxHeight: 420,
                }}
              >
                {/* Header row */}
                <div
                  className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                  style={{ borderBottom: "1px solid var(--border-default)" }}
                >
                  <div className="flex items-center gap-2">
                    <Bell size={14} style={{ color: "var(--text-muted)" }} />
                    <span
                      style={{
                        fontFamily: "var(--font-outfit, sans-serif)",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span
                        className="flex items-center justify-center rounded-full"
                        style={{
                          background: "rgba(59,130,246,0.15)",
                          color: "#60A5FA",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 100,
                        }}
                      >
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.some((n) => !n.is_read) && (
                    <button
                      onClick={() => {
                        onMarkAllRead?.();
                      }}
                      className="flex items-center gap-1 transition-colors"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        fontFamily: "var(--font-outfit, sans-serif)",
                        padding: "4px 6px",
                        borderRadius: 6,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                      title="Mark all as read"
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification list */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center py-10 px-4 text-center"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Bell
                        size={28}
                        style={{ opacity: 0.3, marginBottom: 8 }}
                      />
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontFamily: "var(--font-outfit, sans-serif)",
                          fontWeight: 500,
                        }}
                      >
                        No new notifications
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontFamily: "var(--font-outfit, sans-serif)",
                          marginTop: 2,
                          opacity: 0.6,
                        }}
                      >
                        New contact messages will appear here
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className="w-full text-left flex items-start gap-3 px-4 py-3 transition-colors"
                        style={{
                          background: notif.is_read
                            ? "transparent"
                            : "rgba(59,130,246,0.05)",
                          borderBottom: "1px solid var(--border-default)",
                          border: "none",
                          cursor: "pointer",
                          borderBottomColor: "var(--border-default)",
                          borderBottomWidth: 1,
                          borderBottomStyle: "solid",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "var(--bg-hover)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = notif.is_read
                            ? "transparent"
                            : "rgba(59,130,246,0.05)")
                        }
                      >
                        {/* Icon */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center rounded-lg mt-0.5"
                          style={{
                            width: 32,
                            height: 32,
                            background: notif.is_read
                              ? "var(--bg-tertiary)"
                              : "rgba(59,130,246,0.12)",
                            border: `1px solid ${
                              notif.is_read
                                ? "var(--border-default)"
                                : "rgba(59,130,246,0.2)"
                            }`,
                          }}
                        >
                          <Mail
                            size={14}
                            style={{
                              color: notif.is_read ? "var(--text-muted)" : "#60A5FA",
                            }}
                          />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p
                              className="truncate"
                              style={{
                                fontFamily: "var(--font-outfit, sans-serif)",
                                fontWeight: notif.is_read ? 500 : 700,
                                fontSize: "0.8rem",
                                color: "var(--text-primary)",
                              }}
                            >
                              {notif.title}
                            </p>
                            {!notif.is_read && (
                              <span
                                className="flex-shrink-0 rounded-full"
                                style={{
                                  width: 6,
                                  height: 6,
                                  background: "#3B82F6",
                                  display: "inline-block",
                                }}
                              />
                            )}
                          </div>
                          <p
                            className="truncate"
                            style={{
                              fontFamily: "var(--font-outfit, sans-serif)",
                              fontWeight: 400,
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                              marginTop: 1,
                            }}
                          >
                            {notif.body}
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-outfit, sans-serif)",
                              fontWeight: 400,
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              opacity: 0.6,
                              marginTop: 2,
                            }}
                          >
                            {timeAgo(notif.created_at)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div
                    className="flex-shrink-0 px-4 py-2.5"
                    style={{ borderTop: "1px solid var(--border-default)" }}
                  >
                    <button
                      onClick={() => {
                        setBellOpen(false);
                        router.push("/admin/contact-messages");
                      }}
                      className="w-full text-center transition-colors"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#60A5FA",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        fontFamily: "var(--font-outfit, sans-serif)",
                        padding: "4px 0",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#93C5FD")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#60A5FA")
                      }
                    >
                      View all messages →
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
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
            onClick={() => {
              setAvatarMenuOpen(!avatarMenuOpen);
              setBellOpen(false);
            }}
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
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        fontWeight: 400,
                      }}
                    >
                      Signed in as
                    </p>
                    <p
                      className="truncate"
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-primary)",
                        fontWeight: 600,
                        maxWidth: 170,
                      }}
                    >
                      {userEmail}
                    </p>
                  </div>
                )}
                {[
                  {
                    icon: User,
                    label: "Profile",
                    action: () => {
                      setAvatarMenuOpen(false);
                      router.push("/admin/settings");
                    },
                  },
                  {
                    icon: Settings,
                    label: "Settings",
                    action: () => {
                      setAvatarMenuOpen(false);
                      router.push("/admin/settings");
                    },
                  },
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
                  onClick={() => {
                    setAvatarMenuOpen(false);
                    onLogout?.();
                  }}
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
