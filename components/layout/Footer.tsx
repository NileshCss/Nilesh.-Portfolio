"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { personal } from "@/data/personal";
import type { PersonalInfo } from "@/types";
import { Mail, Download, Sun, Moon, Lock } from "lucide-react";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  );
}

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "Contact", href: "/contact" },
];

const resources = [
  { label: "Resume", href: "/resume" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
];

export function Footer({ personalInfo = personal }: { personalInfo?: PersonalInfo }) {
  const year = new Date().getFullYear();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  const socials = [
    ...(personalInfo.linkedin ? [{ icon: LinkedInIcon, href: personalInfo.linkedin, label: "LinkedIn" }] : []),
    ...(personalInfo.github ? [{ icon: GitHubIcon, href: personalInfo.github, label: "GitHub" }] : []),
    ...(personalInfo.twitter ? [{ icon: XIcon, href: personalInfo.twitter, label: "X / Twitter" }] : []),
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
  ];

  return (
    <footer
      className="border-t transition-colors duration-220"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-8">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10 mb-10">
          {/* Col 1 — Brand */}
          <div>
            {/* Logo Mark + Wordmark */}
            <div className="flex items-center gap-2.5 mb-3">
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
            </div>
            <p className="text-[0.85rem] text-slate-500 dark:text-slate-400 leading-[1.65] max-w-[260px] mb-4">
              Full Stack Developer passionate about building scalable digital solutions and creating impact through technology.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-[34px] h-[34px] flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-[0.78rem] font-black uppercase tracking-[0.07em] mb-4" style={{ color: "var(--text-primary)" }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[0.85rem] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Resources */}
          <div>
            <h4 className="text-[0.78rem] font-black uppercase tracking-[0.07em] mb-4" style={{ color: "var(--text-primary)" }}>
              Resources
            </h4>
            <ul className="space-y-2">
              {resources.map((r) => (
                <li key={r.label}>
                  <Link
                    href={r.href}
                    className="text-[0.85rem] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Let's Connect */}
          <div>
            <h4 className="text-[0.78rem] font-black uppercase tracking-[0.07em] mb-4" style={{ color: "var(--text-primary)" }}>
              Let&apos;s Connect
            </h4>
            <p className="text-[0.8375rem] text-slate-500 dark:text-slate-400 mb-1">{personalInfo.email}</p>
            <p className="text-[0.8375rem] text-slate-500 dark:text-slate-400 mb-5">{personalInfo.location || "India"}</p>
            {personalInfo.resumeUrl && (
              <Link
                href="/resume"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[0.85rem] font-semibold hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              >
                <Download size={14} />
                Download Resume
              </Link>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 py-7 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.8rem] text-slate-400 dark:text-slate-500">
            &copy; {year} {personalInfo.name}. All Rights Reserved.
          </p>

          {/* Utilities: Theme Toggle & Admin Panel */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm cursor-pointer text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                title="Toggle Theme"
              >
                {isDark ? (
                  <>
                    <Sun size={13} className="text-amber-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={13} className="text-slate-500" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            )}

            {/* Admin Panel Link */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Lock size={12} />
              <span>Admin Panel</span>
            </Link>
          </div>

          {personalInfo.openToWork && (
            <div className="flex items-center gap-2 text-[0.8rem] font-semibold text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Available for Opportunities
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
