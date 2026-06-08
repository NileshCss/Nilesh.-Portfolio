"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Menu, X, Calendar, Sun, Moon } from "lucide-react";
import { ConnectModal } from "@/components/ui/ConnectModal";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Expose modal opener globally so HeroSection can call it */
  useEffect(() => {
    (window as Window & { openConnectModal?: () => void }).openConnectModal = () => setModalOpen(true);
    return () => {
      delete (window as Window & { openConnectModal?: () => void }).openConnectModal;
    };
  }, []);

  const isDark = theme === "dark";

  // Prevent hydration flash for theme icon
  const renderThemeToggle = () => {
    if (!mounted) return <div className="w-9 h-9" />;
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title="Switch to light/dark mode"
        aria-label="Toggle theme"
        className="flex items-center justify-center transition-all duration-300 active:scale-95"
        style={{
          width: 36,
          height: 36,
          background: "transparent",
          border: "1px solid var(--border-default)",
          borderRadius: 8,
          color: "var(--text-muted)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--bg-secondary)";
          e.currentTarget.style.color = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    );
  };

  return (
    <>
      <ConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
          scrolled ? "shadow-nav" : ""
        )}
        style={{
          background: "var(--nav-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--nav-border)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo Mark + Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            {/* Logo Mark "N." */}
            <div
              className="relative flex items-center justify-center flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                background: "#0F172A",
                borderRadius: "22%",
              }}
            >
              <span
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: 17,
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
                  width: 6,
                  height: 6,
                  background: "#3B82F6",
                  borderRadius: "50%",
                  bottom: -1,
                  right: -1,
                }}
              />
            </div>
            {/* Wordmark "Nilesh." */}
            <span
              style={{
                fontFamily: "var(--font-outfit, sans-serif)",
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.04em",
              }}
            >
              Nilesh<span style={{ color: "#3B82F6" }}>.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-outfit, sans-serif)",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    padding: "7px 14px",
                    borderRadius: 8,
                    color: active ? "var(--brand-primary)" : "var(--text-muted)",
                    background: active ? "var(--bg-secondary)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.background = "var(--bg-secondary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {renderThemeToggle()}
            
            <button
              id="nav-connect-btn"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 transition-all duration-220 cursor-pointer"
              style={{
                background: "var(--brand-primary)",
                color: "#FFFFFF",
                borderRadius: 8,
                padding: "8px 18px",
                fontFamily: "var(--font-outfit, sans-serif)",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--brand-hover)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--brand-primary)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Calendar size={14} />
              Connect With Me
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 md:hidden">
            {renderThemeToggle()}
            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center transition-colors"
              style={{
                width: 38,
                height: 38,
                background: "transparent",
                border: "1px solid var(--border-default)",
                borderRadius: 8,
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-b transition-all duration-300"
            style={{
              background: "var(--bg-primary)",
              borderColor: "var(--border-default)",
            }}
          >
            <ul className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block transition-colors"
                      style={{
                        fontFamily: "var(--font-outfit, sans-serif)",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                        borderRadius: 8,
                        color: active ? "var(--brand-primary)" : "var(--text-secondary)",
                        background: active ? "var(--bg-secondary)" : "transparent",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2 mt-1" style={{ borderTop: "1px solid var(--border-default)" }}>
                <button
                  onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                  className="w-full text-left flex items-center gap-2 font-semibold"
                  style={{
                    fontFamily: "var(--font-outfit, sans-serif)",
                    fontSize: "0.875rem",
                    padding: "8px 12px",
                    color: "var(--brand-primary)",
                  }}
                >
                  <Calendar size={14} />
                  Connect With Me
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
