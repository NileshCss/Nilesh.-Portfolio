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

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  frontend: { bg: "bg-blue-50", text: "text-blue-600" },
  backend: { bg: "bg-green-50", text: "text-emerald-500" },
  database: { bg: "bg-amber-50", text: "text-amber-600" },
  devops: { bg: "bg-indigo-50", text: "text-indigo-600" },
  tools: { bg: "bg-indigo-50", text: "text-indigo-600" },
  cloud: { bg: "bg-teal-50", text: "text-teal-600" },
  ai: { bg: "bg-purple-50", text: "text-purple-600" },
};

export function SkillsSection({ skills = skillCategories }: { skills?: SkillCategory[] }) {
  return (
    <section id="skills" className="py-[64px] bg-slate-50 border-t border-b border-slate-200">
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

          {/* 6-column grid with dividers */}
          <motion.div
            variants={item}
            className="rounded-xl border border-slate-200 overflow-hidden bg-slate-200 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px"
          >
            {skills.map((col) => {
              const IconComponent = ICON_MAP[col.icon] || Code2;
              const colors = COLOR_MAP[col.id] || COLOR_MAP[col.label.toLowerCase()] || { bg: "bg-slate-50", text: "text-slate-600" };

              return (
                <div
                  key={col.id}
                  className="bg-white px-5 py-6 hover:bg-blue-50 transition-colors duration-200"
                >
                  {/* Column header */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-[30px] h-[30px] rounded-[7px] flex items-center justify-center ${colors.bg}`}>
                      <IconComponent size={14} className={colors.text} />
                    </div>
                    <h3 className="text-[0.875rem] font-bold text-slate-900">{col.label}</h3>
                  </div>

                  {/* Items */}
                  <p className="text-[0.8125rem] text-slate-500 leading-[1.65]">
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
