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
      className="relative pl-8 before:absolute before:left-0 before:top-3 before:h-full before:w-px before:bg-slate-200 last:before:hidden"
    >
      <span className="absolute left-[-5px] top-[10px] h-2.5 w-2.5 rounded-full border-2 border-blue-600 bg-white" />

      <div className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-600 hover:-translate-y-[3px] hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)] transition-all duration-[220ms]">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{exp.role}</h3>
            <p className="text-sm text-blue-600 font-semibold mt-0.5">{exp.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={cn(
                "text-xs px-2.5 py-1 rounded-full font-semibold",
                exp.type === "full-time"
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "bg-violet-50 text-violet-600 border border-violet-100"
              )}
            >
              {exp.type === "full-time" ? "Full-Time" : "Freelance"}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {exp.startDate} – {exp.endDate}
            </span>
          </div>
        </div>

        {exp.domain && (
          <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">{exp.domain}</p>
        )}

        <ul className="space-y-2 mb-5">
          {exp.responsibilities.map((resp, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-500">
              <span className="mt-2 h-1 w-1 rounded-full bg-slate-300 shrink-0" />
              {resp}
            </li>
          ))}
        </ul>

        {exp.highlights && exp.highlights.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">
              Key highlights
            </p>
            <ul className="space-y-1.5">
              {exp.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
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
    <section id="experience" className="py-[72px] bg-white border-t border-slate-200">
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
