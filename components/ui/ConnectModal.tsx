"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Check } from "lucide-react";

/* ─── Types ─── */
type ModalState = "default" | "calendar" | "success";

/* ─── Helpers ─── */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TIME_SLOTS = ["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells: { day: number; type: "prev" | "curr" | "next" }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: "prev" });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: "curr" });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - firstDay - daysInMonth + 1, type: "next" });
  }
  return cells;
}

/* ─── SVG Icons ─── */
function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
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
  const [modalState, setModalState] = useState<ModalState>("default");
  const [calendarOpen, setCalendarOpen] = useState(false);

  /* Calendar state */
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);

  /* Animation mount/unmount */
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setModalState("default");
      setCalendarOpen(false);
      setSelectedDay(null);
      setSelectedTime(null);
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

  const cells = buildCalendar(calYear, calMonth);
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null); setSelectedTime(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null); setSelectedTime(null);
  }

  function isPast(day: number) {
    const d = new Date(calYear, calMonth, day);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  }

  function isToday(day: number) {
    return calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
  }

  function handleConfirm() {
    setModalState("success");
    setTimeout(() => onClose(), 4000);
  }

  const selectedDateStr = selectedDay
    ? `${DAYS[new Date(calYear, calMonth, selectedDay).getDay()]}, ${MONTHS[calMonth]} ${selectedDay}`
    : "";

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
          background: "#FFFFFF",
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
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            color: "#64748B",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E2E8F0"; (e.currentTarget as HTMLButtonElement).style.color = "#0F172A"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#F8FAFC"; (e.currentTarget as HTMLButtonElement).style.color = "#64748B"; }}
        >
          <X size={15} />
        </button>

        {/* ─── SUCCESS STATE ─── */}
        {modalState === "success" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "#10B981", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px",
            }}>
              <Check size={30} color="#fff" strokeWidth={3} />
            </div>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", marginBottom: "10px" }}>
              Meeting Scheduled!
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "#64748B", lineHeight: 1.6, marginBottom: "6px" }}>
              Your 30-minute call is confirmed for <strong>{selectedDateStr}</strong>{selectedTime ? ` at ${selectedTime}` : ""}.
            </p>
            <p style={{ fontSize: "0.875rem", color: "#94A3B8" }}>
              A calendar invite will be sent to your email.
            </p>
          </div>
        )}

        {/* ─── DEFAULT STATE ─── */}
        {modalState !== "success" && (
          <>
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
                color: "#0F172A",
                letterSpacing: "-0.03em",
                marginBottom: "10px",
                lineHeight: 1.2,
              }}>
                Let&apos;s build something.
              </h2>
              <p style={{
                fontSize: "0.9375rem",
                color: "#64748B",
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

              {/* Card 2 — Schedule Call */}
              <div>
                <ContactCard
                  icon={<CalendarIcon />}
                  title="Schedule a Video Call"
                  titleSuffix="30 minute intro call"
                  subtitle="Pick a time that works for you"
                  onClick={() => setCalendarOpen(v => !v)}
                  isExpanded={calendarOpen}
                />

                {/* Inline Calendar */}
                <div style={{
                  overflow: "hidden",
                  maxHeight: calendarOpen ? "600px" : "0",
                  opacity: calendarOpen ? 1 : 0,
                  transition: "max-height 0.3s ease, opacity 0.3s ease",
                }}>
                  <div style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    padding: "20px",
                    marginTop: "10px",
                  }}>
                    {/* Calendar Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <button onClick={prevMonth} style={calNavBtn}>
                        <ChevronLeft size={14} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A", fontFamily: "var(--font-outfit)" }}>
                        {MONTHS[calMonth]} {calYear}
                      </span>
                      <button onClick={nextMonth} style={calNavBtn}>
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    {/* Day headers */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px", marginBottom: "6px" }}>
                      {DAYS.map(d => (
                        <div key={d} style={{ textAlign: "center", fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em", padding: "4px 0" }}>
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Days grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px" }}>
                      {cells.map((cell, idx) => {
                        const isOtherMonth = cell.type !== "curr";
                        const past = !isOtherMonth && isPast(cell.day);
                        const todayCell = !isOtherMonth && isToday(cell.day);
                        const selected = !isOtherMonth && selectedDay === cell.day;
                        const disabled = isOtherMonth || past;

                        return (
                          <button
                            key={idx}
                            disabled={disabled}
                            onClick={() => { setSelectedDay(cell.day); setSelectedTime(null); }}
                            style={{
                              border: "none",
                              borderRadius: "6px",
                              padding: "8px 0",
                              fontSize: "0.825rem",
                              fontFamily: "var(--font-outfit)",
                              cursor: disabled ? "not-allowed" : "pointer",
                              textAlign: "center",
                              fontWeight: selected || todayCell ? 700 : 400,
                              background: selected ? "#2563EB" : todayCell ? "#0F172A" : "transparent",
                              color: selected || todayCell ? "#FFFFFF" : isOtherMonth ? "#E2E8F0" : past ? "#CBD5E1" : "#0F172A",
                              transition: "background 0.15s, color 0.15s",
                            }}
                            onMouseEnter={e => {
                              if (!disabled && !selected && !todayCell) {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(37,99,235,0.08)";
                                (e.currentTarget as HTMLButtonElement).style.color = "#2563EB";
                              }
                            }}
                            onMouseLeave={e => {
                              if (!disabled && !selected && !todayCell) {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                (e.currentTarget as HTMLButtonElement).style.color = isOtherMonth ? "#E2E8F0" : past ? "#CBD5E1" : "#0F172A";
                              }
                            }}
                          >
                            {cell.day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time slots */}
                    {selectedDay && (
                      <div style={{ marginTop: "16px" }}>
                        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A", marginBottom: "10px" }}>
                          Available Times
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                          {TIME_SLOTS.map(t => (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              style={{
                                border: `1px solid ${selectedTime === t ? "#2563EB" : "#E2E8F0"}`,
                                borderRadius: "8px",
                                padding: "8px 4px",
                                fontSize: "0.8rem",
                                fontFamily: "var(--font-mono)",
                                fontWeight: 500,
                                background: selectedTime === t ? "#2563EB" : "white",
                                color: selectedTime === t ? "#FFFFFF" : "#0F172A",
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                              onMouseEnter={e => {
                                if (selectedTime !== t) {
                                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563EB";
                                  (e.currentTarget as HTMLButtonElement).style.color = "#2563EB";
                                }
                              }}
                              onMouseLeave={e => {
                                if (selectedTime !== t) {
                                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                                  (e.currentTarget as HTMLButtonElement).style.color = "#0F172A";
                                }
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Confirm button */}
                    {selectedTime && (
                      <button
                        onClick={handleConfirm}
                        style={{
                          width: "100%",
                          marginTop: "16px",
                          padding: "12px 20px",
                          background: "#2563EB",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          fontFamily: "var(--font-outfit)",
                          cursor: "pointer",
                          transition: "background 0.15s, transform 0.15s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#3B82F6"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#2563EB"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
                      >
                        Confirm Meeting →
                      </button>
                    )}

                    {/* Timezone */}
                    <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#94A3B8", marginTop: "12px" }}>
                      🌍 Timezone: Asia/Kolkata (auto-detected)
                    </p>
                  </div>
                </div>
              </div>

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
                  <span key={text} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "#64748B" }}>
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#94A3B8", display: "inline-block", flexShrink: 0 }} />
                    {text}
                  </span>
                ))}
              </div>

              {/* Separator */}
              <div style={{ height: "1px", background: "#F1F5F9", margin: "0 0 16px" }} />

              {/* Bottom bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontFamily: "var(--font-outfit)" }}>
                  Press{" "}
                  <kbd style={{
                    background: "#F1F5F9",
                    border: "1px solid #E2E8F0",
                    borderRadius: "4px",
                    padding: "1px 6px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "#64748B",
                  }}>esc</kbd>
                  {" "}to close
                </span>
                <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#94A3B8", fontFamily: "var(--font-outfit)" }}>
                  Nilesh Kumar Singh
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Contact Card ─── */
const calNavBtn: React.CSSProperties = {
  width: "28px", height: "28px",
  border: "1px solid #E2E8F0",
  borderRadius: "6px",
  background: "white",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
  color: "#64748B",
};

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  titleSuffix: string;
  subtitle: string;
  onClick?: () => void;
  isExpanded?: boolean;
}

function ContactCard({ icon, title, titleSuffix, subtitle, onClick, isExpanded }: ContactCardProps) {
  const [hovered, setHovered] = useState(false);
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        border: `1px solid ${hovered || isExpanded ? "#0F172A" : "#E2E8F0"}`,
        borderRadius: "14px",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        cursor: isClickable ? "pointer" : "default",
        transform: hovered ? "translateX(2px)" : "none",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Icon */}
      <div style={{
        width: "40px", height: "40px",
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#0F172A",
        flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A", margin: 0, display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
          {title}
          <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "#94A3B8", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
            {titleSuffix}
          </span>
        </p>
        <p style={{ fontSize: "0.8rem", color: "#64748B", margin: "3px 0 0", fontFamily: "var(--font-outfit)" }}>
          {subtitle}
        </p>
      </div>

      {/* Arrow */}
      <ArrowUpRight
        size={16}
        style={{
          color: hovered ? "#0F172A" : "#94A3B8",
          flexShrink: 0,
          transition: "color 0.2s",
        }}
      />
    </div>
  );
}
