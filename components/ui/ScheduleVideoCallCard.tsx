"use client";

import { useState, useRef, useEffect } from 'react';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAY_LABELS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const DAY_NAMES  = ['Sunday','Monday','Tuesday','Wednesday',
                    'Thursday','Friday','Saturday'];
const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM',
                    '2:00 PM','3:00 PM','4:00 PM'];

interface ScheduleVideoCallCardProps {
  onCloseModal: () => void;
}

export function ScheduleVideoCallCard({ onCloseModal }: ScheduleVideoCallCardProps) {
  const now = new Date();
  const [isOpen, setIsOpen]           = useState(false);
  const [calYear, setCalYear]         = useState(now.getFullYear());
  const [calMonth, setCalMonth]       = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [countdown, setCountdown]     = useState(4);
  const [guestName, setGuestName]     = useState("");
  const [guestEmail, setGuestEmail]   = useState("");
  const [timezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "UTC";
    }
  });

  const calendarRef   = useRef<HTMLDivElement>(null);
  const timeSlotsRef  = useRef<HTMLDivElement>(null);
  const confirmRef    = useRef<HTMLDivElement>(null);

  // Generate calendar days
  const calendarDays = generateDays(calYear, calMonth, now);

  // Handle day click
  const handleDayClick = (day: number, isPast: boolean) => {
    if (isPast) return;
    setSelectedDay(prev => prev === day ? null : day);
    setSelectedTime(null);
    if (day !== selectedDay) {
      setTimeout(() => timeSlotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  };

  // Handle time click
  const handleTimeClick = (time: string) => {
    setSelectedTime(prev => prev === time ? null : time);
    if (time !== selectedTime) {
      setTimeout(() => confirmRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  };

  // Handle confirm
  const handleConfirm = async () => {
    if (!selectedDay || !selectedTime) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date(calYear, calMonth, selectedDay).toISOString().split('T')[0],
          time: selectedTime,
          timezone,
          type: 'video_call_30min',
          ...(guestName.trim()  && { name:  guestName.trim()  }),
          ...(guestEmail.trim() && { email: guestEmail.trim() }),
        })
      });
      if (!res.ok) throw new Error('Failed');
      setIsLoading(false);
      setIsSuccess(true);
    } catch {
      setIsLoading(false);
      alert("Failed to schedule meeting. Please try email instead.");
    }
  };

  // Countdown auto-close after success
  useEffect(() => {
    if (!isSuccess) return;
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          onCloseModal();
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSuccess, onCloseModal]);

  // Toggle card open/close
  const toggleCard = () => {
    if (isOpen) {
      setIsOpen(false);
      // Reset if not in success state
      if (!isSuccess) {
        setSelectedDay(null);
        setSelectedTime(null);
      }
    } else {
      setIsOpen(true);
      // Optional: reset to current month if opened fresh
      if (!isSuccess) {
        setCalYear(now.getFullYear());
        setCalMonth(now.getMonth());
      }
    }
  };

  // Prev/Next month
  const prevMonth = () => {
    if (calMonth === now.getMonth() && calYear === now.getFullYear()) return;
    setCalMonth(m => {
      if (m === 0) {
        setCalYear(y => y - 1);
        return 11;
      }
      return m - 1;
    });
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const nextMonth = () => {
    setCalMonth(m => {
      if (m === 11) {
        setCalYear(y => y + 1);
        return 0;
      }
      return m + 1;
    });
    setSelectedDay(null);
    setSelectedTime(null);
  };

  // Get summary text
  const getSummary = () => {
    if (!selectedDay) return '';
    const d = new Date(calYear, calMonth, selectedDay);
    return `${DAY_NAMES[d.getDay()]}, ${MONTHS[calMonth]} ${selectedDay}${selectedTime ? ` at ${selectedTime}` : ''}`;
  };

  const isPrevDisabled = calMonth === now.getMonth() && calYear === now.getFullYear();

  return (
    <div className="schedule-card-wrapper">
      <style>{`
        /* ─────────────────────────────────────────
           CARD BASE
        ───────────────────────────────────────── */
        .contact-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          cursor: pointer;
          position: relative;
          transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          text-align: left;
          width: 100%;
        }
        .contact-card:hover {
          border-color: #0F172A;
          background: #FAFAFA;
        }
        .contact-card.selected {
          border-color: #2563EB;
          background: rgba(37, 99, 235, 0.02);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
        }
        .contact-card:focus-visible {
          outline: 2px solid #2563EB;
          outline-offset: 2px;
        }

        /* ─────────────────────────────────────────
           CARD ICON
        ───────────────────────────────────────── */
        .contact-card-icon {
          width: 40px;
          height: 40px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #475569;
        }

        /* ─────────────────────────────────────────
           CARD CONTENT
        ───────────────────────────────────────── */
        .contact-card-content { flex: 1; min-width: 0; }
        .contact-card-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 3px;
        }
        .contact-card-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.9375rem;
          color: #0F172A;
        }
        .contact-card-tag {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          font-size: 0.75rem;
          color: #64748B;
          letter-spacing: 0.02em;
        }
        .contact-card-subtitle {
          font-size: 0.8125rem;
          color: #64748B;
          font-weight: 400;
          font-family: 'Outfit', sans-serif;
          margin-top: 3px;
        }

        /* ─────────────────────────────────────────
           CHEVRON (Alternative to Arrow)
        ───────────────────────────────────────── */
        .contact-card-arrow {
          color: #94A3B8;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          position: absolute;
          top: 50%;
          right: 18px;
          transform: translateY(-50%) rotate(0deg);
        }
        .contact-card.selected .contact-card-arrow {
          transform: translateY(-50%) rotate(90deg);
        }

        /* ─────────────────────────────────────────
           CALENDAR PANEL
        ───────────────────────────────────────── */
        .calendar-panel {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(-8px);
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .calendar-panel.open {
          max-height: 800px;
          opacity: 1;
          transform: translateY(0);
        }
        .calendar-inner {
          margin-top: 10px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 20px;
        }

        /* ─────────────────────────────────────────
           CALENDAR HEADER
        ───────────────────────────────────────── */
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .cal-nav-btn {
          width: 30px;
          height: 30px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748B;
          font-size: 1rem;
          transition: border-color 0.2s, color 0.2s;
        }
        .cal-nav-btn:hover:not(:disabled) {
          border-color: #0F172A;
          color: #0F172A;
        }
        .cal-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .cal-month-label {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.9375rem;
          color: #0F172A;
          letter-spacing: -0.01em;
          text-align: center;
        }

        /* ─────────────────────────────────────────
           DAY GRID
        ───────────────────────────────────────── */
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 3px;
        }
        .cal-day-header-row {
          margin-bottom: 6px;
        }
        .cal-day-header {
          font-family: 'Outfit', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          color: #94A3B8;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 0;
        }
        .cal-day {
          font-family: 'Outfit', sans-serif;
          font-size: 0.825rem;
          font-weight: 400;
          text-align: center;
          padding: 8px 2px;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          user-select: none;
        }
        .cal-day.empty { background: transparent; pointer-events: none; }
        .cal-day.other-month { color: #CBD5E1; pointer-events: none; opacity: 0.5; }
        .cal-day.past { color: #CBD5E1; cursor: not-allowed; pointer-events: none; opacity: 0.45; }
        .cal-day.today {
          background: #0F172A;
          color: #FFFFFF;
          font-weight: 700;
          position: relative;
        }
        .cal-day.today::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #3B82F6;
          border-radius: 50%;
        }
        .cal-day.today.selected::after { display: none; }
        .cal-day.available:hover {
          background: rgba(37, 99, 235, 0.08);
          color: #2563EB;
        }
        .cal-day.selected {
          background: #2563EB;
          color: #FFFFFF;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        /* ─────────────────────────────────────────
           TIME SLOTS
        ───────────────────────────────────────── */
        .time-slots-section {
          margin-top: 16px;
          animation: fadeSlideUp 0.25s ease 0.1s both;
        }
        .time-slots-label {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.78rem;
          color: #0F172A;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .time-slots-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        @media (max-width: 480px) {
          .time-slots-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .time-slot {
          padding: 9px 12px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          font-size: 0.8rem;
          color: #0F172A;
          background: #FFFFFF;
          transition: border-color 0.15s, color 0.15s, background 0.15s, box-shadow 0.15s;
          white-space: nowrap;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .time-slot:hover {
          border-color: #2563EB;
          color: #2563EB;
          background: rgba(37, 99, 235, 0.04);
        }
        .time-slot.selected {
          background: #2563EB;
          color: #FFFFFF;
          border-color: #2563EB;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(37, 99, 235, 0.25);
        }
        .time-slot:active { transform: scale(0.97); }

        /* ─────────────────────────────────────────
           SUMMARY + CONFIRM
        ───────────────────────────────────────── */
        .meeting-summary {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 0.8375rem;
          color: #0F172A;
          text-align: center;
          padding: 10px 14px;
          background: rgba(37, 99, 235, 0.06);
          border: 1px solid rgba(37, 99, 235, 0.15);
          border-radius: 8px;
          margin-top: 12px;
          animation: fadeSlideUp 0.25s ease 0.05s both;
        }
        .confirm-btn {
          width: 100%;
          padding: 13px 20px;
          background: #2563EB;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.9375rem;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          margin-top: 14px;
          animation: fadeSlideUp 0.25s ease 0.05s both;
        }
        .confirm-btn:hover:not(:disabled) {
          background: #3B82F6;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
        }
        .confirm-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: none;
        }
        .confirm-btn:disabled {
          opacity: 0.8;
          cursor: wait;
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* ─────────────────────────────────────────
           TIMEZONE
        ───────────────────────────────────────── */
        .timezone-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
        }
        .timezone-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          color: #64748B;
        }
        .timezone-value {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          font-size: 0.78rem;
          color: #0F172A;
        }

        /* ─────────────────────────────────────────
           SUCCESS STATE
        ───────────────────────────────────────── */
        .success-state {
          text-align: center;
          padding: 28px 20px;
          background: rgba(16, 185, 129, 0.04);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 12px;
          animation: successEntrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .success-icon {
          width: 52px;
          height: 52px;
          background: #10B981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          animation: iconBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .success-headline {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.1875rem;
          color: #0F172A;
          margin-bottom: 8px;
        }
        .success-body {
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          font-size: 0.9rem;
          color: #64748B;
          line-height: 1.6;
        }
        .success-body strong {
          font-weight: 600;
          color: #0F172A;
        }
        .success-note {
          font-family: 'Outfit', sans-serif;
          font-size: 0.8125rem;
          color: #64748B;
          margin-top: 8px;
        }
        .success-countdown {
          font-size: 0.75rem;
          color: #94A3B8;
          margin-top: 14px;
        }

        /* ─────────────────────────────────────────
           KEYFRAME ANIMATIONS
        ───────────────────────────────────────── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes successEntrance {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes iconBounce {
          0%   { transform: scale(0); }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* THE CARD */}
      <div
        className={`contact-card ${isOpen ? 'selected' : ''}`}
        onClick={toggleCard}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && toggleCard()}
        aria-expanded={isOpen}
        aria-label="Schedule a Video Call - 30 minute intro call"
      >
        <div className="contact-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '18px', height: '18px' }}>
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        </div>
        <div className="contact-card-content">
          <div className="contact-card-title-row">
            <span className="contact-card-title">Schedule a Video Call</span>
            <span className="contact-card-tag">30 minute intro call</span>
          </div>
          <p className="contact-card-subtitle">Pick a time that works for you</p>
        </div>
        <div className="contact-card-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>

      {/* INLINE CALENDAR PANEL */}
      <div className={`calendar-panel ${isOpen ? 'open' : ''}`}>
        <div className="calendar-inner">
          {!isSuccess ? (
            <>
              {/* Calendar header */}
              <div className="cal-header">
                <button className="cal-nav-btn" onClick={prevMonth} disabled={isPrevDisabled} aria-label="Previous month">
                  ‹
                </button>
                <div className="cal-month-label">
                  {MONTHS[calMonth]} {calYear}
                </div>
                <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
                  ›
                </button>
              </div>

              {/* Day headers */}
              <div className="cal-grid cal-day-header-row">
                {DAY_LABELS.map(d => (
                  <div key={d} className="cal-day-header">{d}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="cal-grid">
                {calendarDays.map((c, i) => {
                  if (c.empty) return <div key={i} className="cal-day empty" />;
                  
                  const isSelected = selectedDay === c.day;
                  let className = "cal-day";
                  if (c.isPast) className += " past";
                  else className += " available";
                  
                  if (c.isToday) className += " today";
                  if (isSelected) className += " selected";

                  return (
                    <div
                      key={i}
                      className={className}
                      onClick={() => handleDayClick(c.day!, c.isPast!)}
                      role="gridcell"
                      aria-label={`${MONTHS[calMonth]} ${c.day}, ${calYear}`}
                      aria-selected={isSelected}
                      aria-disabled={c.isPast}
                    >
                      {c.day}
                    </div>
                  );
                })}
              </div>

              {/* Time slots */}
              {selectedDay && (
                <div className="time-slots-section" ref={timeSlotsRef}>
                  <div className="time-slots-label">Available Times</div>
                  <div className="time-slots-grid" role="radiogroup" aria-label="Select meeting time">
                    {TIME_SLOTS.map(t => (
                      <div
                        key={t}
                        className={`time-slot ${selectedTime === t ? 'selected' : ''}`}
                        onClick={() => handleTimeClick(t)}
                        role="radio"
                        aria-checked={selectedTime === t}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && handleTimeClick(t)}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary + Confirm */}
              {selectedTime && (
                <div ref={confirmRef}>
                  <div className="meeting-summary">
                    📅 {getSummary()}
                  </div>

                  {/* Optional guest details for confirmation email */}
                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: '8px',
                        border: '1px solid #E2E8F0', fontSize: '0.85rem',
                        fontFamily: "'Outfit', sans-serif", outline: 'none',
                        color: '#0F172A', background: '#fff', boxSizing: 'border-box',
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Your email — get a confirmation (optional)"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: '8px',
                        border: '1px solid #E2E8F0', fontSize: '0.85rem',
                        fontFamily: "'Outfit', sans-serif", outline: 'none',
                        color: '#0F172A', background: '#fff', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button 
                    className="confirm-btn" 
                    onClick={handleConfirm}
                    disabled={isLoading}
                    aria-label={`Confirm meeting on ${getSummary()}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                          <path d="M9 16l2 2 4-4"></path>
                        </svg>
                        Confirm Meeting →
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Timezone */}
              <div className="timezone-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#94A3B8' }}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span className="timezone-text">Timezone:</span>
                <span className="timezone-value">{timezone}</span>
              </div>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="success-state" role="status" aria-live="polite" aria-label="Meeting successfully scheduled">
              <div className="success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="success-headline">Meeting Scheduled!</div>
              <div className="success-body">
                Your 30-minute call is confirmed for <br />
                <strong>{getSummary()}</strong>
              </div>
              <div className="success-note">
                {guestEmail
                  ? `A confirmation has been sent to ${guestEmail}.`
                  : "Nilesh will be in touch to confirm your time slot."}
              </div>
              <div className="success-countdown">
                Closing in {countdown}s...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper: generate calendar days
function generateDays(year: number, month: number, today: Date) {
  const firstDay = new Date(year, month, 1).getDay();
  const total    = new Date(year, month + 1, 0).getDate();
  const todayMidnight = new Date(today);
  todayMidnight.setHours(0, 0, 0, 0);

  const days: { empty?: boolean; day?: number; isPast?: boolean; isToday?: boolean }[] = [];
  for (let i = 0; i < firstDay; i++) days.push({ empty: true });
  for (let d = 1; d <= total; d++) {
    const thisDate = new Date(year, month, d);
    days.push({
      day:     d,
      isPast:  thisDate < todayMidnight,
      isToday: d === today.getDate() &&
               month === today.getMonth() &&
               year === today.getFullYear()
    });
  }
  return days;
}
