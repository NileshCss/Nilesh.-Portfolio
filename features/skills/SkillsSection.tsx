"use client";

import { motion, type Variants } from "framer-motion";
import { Code2, Monitor, Database, Wrench, Cloud, Sparkles, Server, GitBranch } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { skillCategories } from "@/data/skills";
import type { SkillCategory } from "@/types";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "tween" } },
};

const ICON_MAP: Record<string, any> = {
  Monitor,
  Server,
  Database,
  GitBranch,
  Sparkles,
  Code2,
  Wrench,
  Cloud,
};

/* Opacity-based icon palettes — work in both light and dark mode */
const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  frontend: { bg: "bg-blue-500/10",    text: "text-blue-600 dark:text-blue-400" },
  backend:  { bg: "bg-emerald-500/10", text: "text-emerald-500 dark:text-emerald-400" },
  database: { bg: "bg-amber-500/10",   text: "text-amber-600 dark:text-amber-400" },
  devops:   { bg: "bg-indigo-500/10",  text: "text-indigo-600 dark:text-indigo-400" },
  tools:    { bg: "bg-indigo-500/10",  text: "text-indigo-600 dark:text-indigo-400" },
  cloud:    { bg: "bg-teal-500/10",    text: "text-teal-600 dark:text-teal-400" },
  ai:       { bg: "bg-purple-500/10",  text: "text-purple-600 dark:text-purple-400" },
};

export function SkillsSection({ skills = skillCategories }: { skills?: SkillCategory[] }) {
  return (
    <section id="skills" className="py-[64px] bg-muted border-t border-b border-border-base">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div variants={item}>
            <SectionHeader
              eyebrow="Technologies I Work With"
              title="Tools of the trade."
              description="The full stack of technologies I use to build, ship, and scale products."
              accentUnderline
            />
          </motion.div>

          {/* 6-column grid — gap color uses border token */}
          <motion.div
            variants={item}
            className="rounded-xl border border-border-base overflow-hidden bg-[var(--border-default)] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px"
          >
            {skills.map((col) => {
              const IconComponent = ICON_MAP[col.icon] || Code2;
              const colors = COLOR_MAP[col.id] || COLOR_MAP[col.label.toLowerCase()] || { bg: "bg-muted", text: "text-foreground-muted" };

              return (
                <div
                  key={col.id}
                  className="bg-card px-5 py-6 hover:bg-blue-500/5 transition-colors duration-200"
                >
                  {/* Column header */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-[30px] h-[30px] rounded-[7px] flex items-center justify-center ${colors.bg}`}>
                      <IconComponent size={14} className={colors.text} />
                    </div>
                    <h3 className="text-[0.875rem] font-bold text-foreground">{col.label}</h3>
                  </div>

                  {/* Items */}
                  <p className="text-[0.8125rem] text-foreground-muted leading-[1.65]">
                    {col.skills.map((s) => s.name).join(", ")}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
