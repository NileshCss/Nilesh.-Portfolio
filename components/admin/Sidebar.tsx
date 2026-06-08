"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Zap,
  Trophy,
  Award,
  FileText,
  Share2,
  Mail,
  BarChart2,
  Search,
  ImageIcon,
  Settings,
  Users,
  Clock,
  Menu,
  ChevronDown,
  LogOut,
  User,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTheme } from "next-themes";

const navSections = [
  {
    label: "MAIN",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Experience", href: "/admin/experience", icon: Briefcase },
      { label: "Skills", href: "/admin/skills", icon: Zap },
      { label: "Achievements", href: "/admin/achievements", icon: Trophy },
      { label: "Certifications", href: "/admin/certifications", icon: Award },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { label: "Resume", href: "/admin/resume", icon: FileText },
      { label: "Social Links", href: "/admin/social-links", icon: Share2 },
      { label: "Contact Messages", href: "/admin/contact-messages", icon: Mail, badge: true },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
      { label: "SEO Manager", href: "/admin/seo", icon: Search },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Activity Logs", href: "/admin/activity-logs", icon: Clock },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  unreadCount?: number;
}

export function Sidebar({ collapsed, onToggle, onLogout, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard" || pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300 ease-out",
        "border-r",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
      style={{
        background: "var(--sidebar-bg)",
        borderColor: "var(--sidebar-border)",
      }}
    >
      {/* ── Top: Logo + Hamburger ── */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
          {/* N. Logo mark — always dark bg (brand identity) */}
          <div
            className="flex-shrink-0 flex items-center justify-center relative"
            style={{
              width: 36,
              height: 36,
              background: "#0F172A",
              border: "1.5px solid var(--sidebar-border)",
              borderRadius: "22%",
            }}
          >
            <span
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: 900,
                fontSize: 19,
                color: "#FFFFFF",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              N
            </span>
            <span
              className="absolute"
              style={{
                width: 7,
                height: 7,
                background: "#3B82F6",
                borderRadius: "50%",
                bottom: -2,
                right: -2,
              }}
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span
                style={{
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                N<span style={{ color: "#3B82F6" }}>.</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 400,
                  fontSize: "0.72rem",
                  color: "var(--sidebar-section)",
                }}
              >
                Admin Panel
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={onToggle}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
          className="flex-shrink-0 flex items-center justify-center transition-all duration-200"
          style={{
            width: 32,
            height: 32,
            background: "transparent",
            border: "1px solid var(--sidebar-border)",
            borderRadius: 7,
            color: "var(--sidebar-icon)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--sidebar-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <Menu size={15} />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: "8px 10px", paddingTop: 12 }}>
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p
                className="mb-1"
                style={{
                  padding: "8px 8px 4px",
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  color: "var(--sidebar-section)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const showBadge = item.badge && unreadCount > 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                    className="group relative flex items-center gap-2.5 rounded-lg transition-all duration-200"
                    style={{
                      padding: "10px 12px",
                      background: active ? "var(--sidebar-active-bg)" : "transparent",
                      color: active
                        ? "var(--sidebar-active-text)"
                        : "var(--sidebar-text)",
                      fontFamily: "var(--font-outfit, sans-serif)",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "var(--sidebar-hover)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--sidebar-text)";
                      }
                    }}
                  >
                    {active && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                        style={{
                          width: 3,
                          height: 20,
                          background: "#3B82F6",
                        }}
                      />
                    )}
                    <Icon
                      size={18}
                      className="flex-shrink-0"
                      style={{
                        color: active
                          ? "var(--sidebar-active-text)"
                          : "var(--sidebar-icon)",
                      }}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {showBadge && !collapsed && (
                      <span
                        className="flex items-center justify-center rounded-full"
                        style={{
                          background: "rgba(59,130,246,0.2)",
                          color: "#60A5FA",
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: 100,
                          minWidth: 20,
                        }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                    {showBadge && collapsed && (
                      <span
                        className="absolute top-1 right-1 flex items-center justify-center rounded-full"
                        style={{
                          width: 16,
                          height: 16,
                          background: "#3B82F6",
                          color: "#fff",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                        }}
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom: User Info Card ── */}
      <div
        className="flex-shrink-0"
        style={{
          borderTop: "1px solid var(--sidebar-border)",
          padding: "12px 10px",
        }}
      >
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-2.5 rounded-lg transition-all duration-200"
            style={{
              padding: "10px 12px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--sidebar-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {/* Avatar = N. logo 36px — always dark */}
            <div
              className="flex-shrink-0 flex items-center justify-center relative"
              style={{
                width: 36,
                height: 36,
                background: "#0F172A",
                border: "1.5px solid var(--sidebar-border)",
                borderRadius: "22%",
              }}
            >
              <span
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: 17,
                  color: "#FFFFFF",
                }}
              >
                N
              </span>
              <span
                className="absolute"
                style={{
                  width: 6,
                  height: 6,
                  background: "#3B82F6",
                  borderRadius: "50%",
                  bottom: -1,
                  right: -1,
                }}
              />
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p
                    className="truncate"
                    style={{
                      fontFamily: "var(--font-outfit, sans-serif)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    Nilesh Kumar Singh
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit, sans-serif)",
                      fontWeight: 400,
                      fontSize: "0.72rem",
                      color: "var(--sidebar-section)",
                    }}
                  >
                    Admin
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  style={{
                    color: "var(--sidebar-icon)",
                    transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                  }}
                />
              </>
            )}
          </button>

          {/* Dropdown */}
          {userMenuOpen && !collapsed && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden z-50"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-strong)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid var(--border-default)" }}>
                <p style={{ fontSize: "0.72rem", color: "var(--sidebar-section)", fontWeight: 400 }}>
                  Signed in as
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>
                  Nilesh Kumar Singh
                </p>
              </div>
              {[
                { icon: User, label: "View Profile" },
                { icon: KeyRound, label: "Change Password" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
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
                  <Icon size={14} style={{ color: "var(--sidebar-icon)" }} />
                  {label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid var(--border-default)" }} />
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
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
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
