"use client";

import { motion, type Variants } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { experiences } from "@/data/experience";
import type { Experience } from "@/types";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, type: "tween" } },
};

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <motion.div
      variants={item}
      className="relative pl-8 before:absolute before:left-0 before:top-3 before:h-full before:w-px before:bg-[var(--border-default)] last:before:hidden"
    >
      <span className="absolute left-[-5px] top-[10px] h-2.5 w-2.5 rounded-full border-2 border-blue-600 dark:border-blue-500 bg-card" />

      <div className="group p-6 rounded-2xl border border-border-base bg-card hover:border-blue-600 dark:hover:border-blue-500 hover:-translate-y-[3px] hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)] transition-all duration-[220ms]">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">{exp.role}</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{exp.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={cn(
                "text-xs px-2.5 py-1 rounded-full font-semibold",
                exp.type === "full-time"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                  : "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20"
              )}
            >
              {exp.type === "full-time" ? "Full-Time" : "Freelance"}
            </span>
            <span className="text-xs text-foreground-faint font-mono">
              {exp.startDate} – {exp.endDate}
            </span>
          </div>
        </div>

        {exp.domain && (
          <p className="text-xs font-bold text-foreground-faint mb-4 uppercase tracking-wider">{exp.domain}</p>
        )}

        <ul className="space-y-2 mb-5">
          {exp.responsibilities.map((resp, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground-muted">
              <span className="mt-2 h-1 w-1 rounded-full bg-[var(--border-strong)] shrink-0" />
              {resp}
            </li>
          ))}
        </ul>

        {exp.highlights && exp.highlights.length > 0 && (
          <div className="pt-4 border-t border-border-base">
            <p className="text-xs font-bold text-foreground-faint uppercase tracking-widest mb-2.5">
              Key highlights
            </p>
            <ul className="space-y-1.5">
              {exp.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ExperienceSection({ experiences: experiencesList = experiences }: { experiences?: Experience[] }) {
  return (
    <section id="experience" className="py-[72px] bg-surface border-t border-border-base">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div variants={item}>
            <SectionHeader
              eyebrow="Experience"
              title="Where I've worked."
              description="A blend of professional operations experience and hands-on product development."
              accentUnderline
            />
          </motion.div>

          <div className="space-y-6 mt-4">
            {experiencesList.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
