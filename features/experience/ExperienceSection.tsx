"use client";

import { useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { experiences as staticExperiences } from "@/data/experience";
import type { Experience } from "@/types";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronUp, Briefcase } from "lucide-react";

// ── Animation variants ────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Constants ─────────────────────────────────────────────────────────────

/** Max responsibilities shown before "View more" toggle */
const MAX_RESP = 4;
/** Max highlights shown — keeps right column from overwhelming left */
const MAX_HIGHLIGHTS = 4;

// ── Company Logo with initials fallback ──────────────────────────────────

function CompanyLogo({
  company,
  logoUrl,
}: {
  company: string;
  logoUrl?: string | null;
}) {
  const [imgError, setImgError] = useState(false);

  const initials = company
    .split(/[\s&.,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (logoUrl && !imgError) {
    return (
      <div
        className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-border-base bg-card"
        aria-hidden="true"
      >
        <img
          src={logoUrl}
          alt={`${company} logo`}
          width={48}
          height={48}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold text-base select-none"
      aria-hidden="true"
    >
      {initials || <Briefcase className="w-5 h-5" />}
    </div>
  );
}

// ── Employment type badge ─────────────────────────────────────────────────

function TypeBadge({ type }: { type: Experience["type"] }) {
  const label =
    type === "full-time"
      ? "Full-Time"
      : type === "freelance"
      ? "Freelance"
      : "Contract";

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
      {label}
    </span>
  );
}

// ── Skeleton card for loading state ──────────────────────────────────────

export function ExperienceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-base bg-card p-6 md:p-8 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
          <div className="space-y-2.5">
            <div className="h-5 w-48 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          <div className="h-6 w-20 rounded-full bg-muted" />
          <div className="h-4 w-36 rounded bg-muted" />
        </div>
      </div>
      {/* Body skeleton — items-start so skeleton matches real card */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-start">
        <div className="space-y-3">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-muted shrink-0 mt-0.5" />
                <div className="h-4 flex-1 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Individual experience card ────────────────────────────────────────────

function ExperienceCard({ exp }: { exp: Experience }) {
  const [respExpanded, setRespExpanded] = useState(false);

  // ── ROOT FIX 2: Cap responsibilities at MAX_RESP by default
  const displayedResp = respExpanded
    ? exp.responsibilities
    : exp.responsibilities.slice(0, MAX_RESP);
  const hasMoreResp = exp.responsibilities.length > MAX_RESP;

  // ── ROOT FIX 3: Cap highlights at MAX_HIGHLIGHTS — prevents right column
  //    from growing taller than the left and creating blank space.
  const highlights = (exp.highlights ?? []).slice(0, MAX_HIGHLIGHTS);
  const hasHighlights = highlights.length > 0;

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        "group relative bg-card border border-border-base rounded-2xl overflow-hidden",
        "hover:border-blue-500/40 hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)]",
        "transition-all duration-300"
      )}
      aria-label={`${exp.role} at ${exp.company}`}
    >
      <div className="p-6 md:p-8">
        {/* ── Card header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          {/* Left: logo + title + company + domain */}
          <div className="flex items-start gap-4 min-w-0">
            <CompanyLogo company={exp.company} logoUrl={exp.companyLogoUrl} />
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                {exp.role}
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">
                  {exp.company}
                </span>
                {exp.domain && (
                  <>
                    <span
                      className="text-foreground-faint hidden sm:inline"
                      aria-hidden="true"
                    >
                      ·
                    </span>
                    <span className="text-xs font-medium text-foreground-muted bg-muted px-2 py-0.5 rounded-md border border-border-base">
                      {exp.domain}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: badge + dates */}
          <div className="flex flex-row sm:flex-col sm:items-end items-center gap-2 shrink-0">
            <TypeBadge type={exp.type} />
            <span className="text-xs text-foreground-faint font-mono font-medium whitespace-nowrap">
              <time dateTime={exp.startDate}>{exp.startDate}</time>
              {" – "}
              <time dateTime={exp.endDate}>{exp.endDate}</time>
            </span>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div className="h-px bg-border-base mb-6" />

        {/* ── Card body ───────────────────────────────────────────────── */}
        {/*
          ROOT FIX 1: `items-start` on the grid.
          Without it, CSS Grid stretches both children to the same row height,
          which creates a blank area below the shorter column.
          `items-start` lets each column be only as tall as its content.
        */}
        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            hasHighlights && "lg:grid-cols-[3fr_2fr] lg:gap-8"
          )}
          style={{ alignItems: "start" }} // belt-and-suspenders alongside Tailwind
        >
          {/* Left: Key Responsibilities */}
          <div className="self-start">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground-faint mb-3">
              Key Responsibilities
            </h4>
            <ul
              className="space-y-2.5"
              aria-label={`Responsibilities as ${exp.role}`}
            >
              <AnimatePresence initial={false}>
                {displayedResp.map((resp, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0 p-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 transition-colors group-hover:bg-blue-500/10 group-hover:border-blue-400/30">
                      <Check
                        className="w-3.5 h-3.5"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-sm text-foreground-muted leading-relaxed">
                      {resp}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {/* Expand / collapse for extra responsibilities */}
            {hasMoreResp && (
              <button
                onClick={() => setRespExpanded(!respExpanded)}
                aria-expanded={respExpanded}
                className={cn(
                  "mt-3 inline-flex items-center gap-1.5 text-xs font-semibold",
                  "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                  "transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 rounded"
                )}
              >
                {respExpanded ? (
                  <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>
                    +{exp.responsibilities.length - MAX_RESP} more{" "}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right: Key Contributions — only rendered when highlights exist */}
          {hasHighlights && (
            <div className="self-start">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground-faint mb-3">
                Key Contributions
              </h4>
              {/*
                Two-column grid for highlights on the right.
                Keeps each item compact; max 4 items = 2×2 grid, perfectly balanced.
              */}
              <div className="grid grid-cols-2 gap-2">
                {highlights.map((label, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl",
                      "bg-muted border border-border-base",
                      "group-hover:border-blue-500/20 transition-colors"
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 flex-none" />
                    <span className="text-xs font-medium text-foreground leading-snug">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Technology tags footer ───────────────────────────────────── */}
        {exp.technologyTags && exp.technologyTags.length > 0 && (
          <>
            <div className="h-px bg-border-base mt-6 mb-4" />
            <div className="flex flex-wrap gap-2" aria-label="Tools and domains">
              {exp.technologyTags.map((tag, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium",
                    "text-foreground-muted bg-muted border border-border-base",
                    "hover:border-blue-400/30 hover:text-foreground transition-colors"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.article>
  );
}

// ── Main section export ───────────────────────────────────────────────────

export function ExperienceSection({
  experiences: experiencesList = staticExperiences,
}: {
  experiences?: Experience[];
}) {
  const visible = experiencesList.filter((e) => e.isVisible !== false);

  if (visible.length === 0) return null;

  return (
    <section
      id="experience"
      className="py-24 bg-surface border-t border-border-base"
      aria-label="Work Experience"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          {/* ── Section header ───────────────────────────────────────── */}
          <motion.div variants={headerVariants} className="mb-14">
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="w-2 h-2 rounded-full bg-blue-600 inline-block"
                aria-hidden="true"
              />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                EXPERIENCE
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-1">
              Where I&apos;ve worked.
              <span
                className="block h-1 w-16 mt-3 rounded-full bg-blue-600/60"
                aria-hidden="true"
              />
            </h2>

            <p className="mt-5 text-base md:text-lg text-foreground-muted max-w-2xl leading-relaxed">
              A blend of professional operations experience and hands-on product
              development.
            </p>
          </motion.div>

          {/* ── Cards ────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {visible.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
