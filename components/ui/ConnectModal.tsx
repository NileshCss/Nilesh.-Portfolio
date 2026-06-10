"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { ScheduleVideoCallCard } from "./ScheduleVideoCallCard";

/* ─── SVG Icons ─── */
function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

/* ─── Main Component ─── */
interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Animation mount/unmount */
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 220);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  /* ESC key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Lock body scroll */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.22s ease",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "20px",
          maxWidth: "540px",
          width: "100%",
          padding: "40px",
          position: "relative",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute", top: "16px", right: "16px",
            width: "32px", height: "32px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
            borderRadius: "8px",
            color: "var(--text-muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          {/* Available badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginBottom: "20px" }}>
            <span style={{
              background: "rgba(249,115,22,0.08)",
              border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: "100px",
              padding: "5px 14px",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#F97316",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F97316", display: "inline-block" }} />
              Available now
            </span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            marginBottom: "10px",
            lineHeight: 1.2,
          }}>
            Let&apos;s build something.
          </h2>
          <p style={{
            fontSize: "0.9375rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            maxWidth: "380px",
            margin: "0 auto",
          }}>
            Available for full-time roles, freelance projects and startup collaborations.
          </p>
        </div>

        {/* Contact Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>

          {/* Card 1 — Email */}
          <a
            href="mailto:rajputnileshsingh25@gmail.com"
            style={{ textDecoration: "none" }}
          >
            <ContactCard
              icon={<EmailIcon />}
              title="Email"
              titleSuffix="rajputnileshsingh25@gmail.com"
              subtitle="Usually replies within 24 hours"
            />
          </a>

          {/* Card 2 — Schedule Call (Self-contained component) */}
          <ScheduleVideoCallCard onCloseModal={onClose} />

          {/* Card 3 — LinkedIn */}
          <a
            href="https://www.linkedin.com/in/nileshkumarsingh-dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <ContactCard
              icon={<LinkedInIcon />}
              title="LinkedIn"
              titleSuffix="@nileshkumarsingh-dev"
              subtitle="Connect professionally and send a message"
            />
          </a>
        </div>

        {/* Modal Footer */}
        <div>
          {/* Info pills */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginBottom: "16px" }}>
            {["Based in Bihar, India", "Open to remote work", "Open to freelance projects"].map(text => (
              <span key={text} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--text-light)", display: "inline-block", flexShrink: 0 }} />
                {text}
              </span>
            ))}
          </div>

          {/* Separator */}
          <div style={{ height: "1px", background: "var(--border-default)", margin: "0 0 16px" }} />

          {/* Bottom bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-light)", fontFamily: "var(--font-outfit)" }}>
              Press{" "}
              <kbd style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
                borderRadius: "4px",
                padding: "1px 6px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
              }}>esc</kbd>
              {" "}to close
            </span>
            <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-light)", fontFamily: "var(--font-outfit)" }}>
              Nilesh Kumar Singh
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Contact Card ─── */
interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  titleSuffix: string;
  subtitle: string;
}

function ContactCard({ icon, title, titleSuffix, subtitle }: ContactCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--border-strong)" : "var(--border-default)"}`,
        borderRadius: "14px",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        cursor: "pointer",
        transform: hovered ? "translateX(2px)" : "none",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Icon */}
      <div style={{
        width: "40px", height: "40px",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-default)",
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-primary)",
        flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
          {title}
          <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--text-light)", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
            {titleSuffix}
          </span>
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "3px 0 0", fontFamily: "var(--font-outfit)" }}>
          {subtitle}
        </p>
      </div>

      {/* Arrow */}
      <ArrowUpRight
        size={16}
        style={{
          color: hovered ? "var(--text-primary)" : "var(--text-light)",
          flexShrink: 0,
          transition: "color 0.2s",
        }}
      />
    </div>
  );
}
