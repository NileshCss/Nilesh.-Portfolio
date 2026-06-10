"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { GraduationCap, Layers, Package, Rocket, Code2, BookOpen } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { achievements } from "@/data/achievements";
import type { Achievement } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Layers,
  Package,
  Rocket,
  Code2,
  BookOpen,
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, type: "tween" },
  },
};

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = iconMap[achievement.icon] ?? Code2;

  return (
    <motion.div
      variants={item}
      className="group p-5 rounded-2xl border border-border-base bg-card hover:border-blue-600 dark:hover:border-blue-500 hover:-translate-y-[3px] hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)] transition-all duration-[220ms]"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/15 transition-colors">
          <Icon size={18} className="text-blue-600 dark:text-blue-400" />
        </span>
        {achievement.year && (
          <span className="text-xs font-mono text-foreground-faint">{achievement.year}</span>
        )}
      </div>
      <h3 className="text-sm font-bold text-foreground mb-2">{achievement.title}</h3>
      <p className="text-sm text-foreground-muted leading-relaxed">{achievement.description}</p>
    </motion.div>
  );
}

export function AchievementsSection({ achievements: achievementsList = achievements }: { achievements?: Achievement[] }) {
  return (
    <section id="achievements" className="py-[72px] bg-muted border-t border-b border-border-base">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div variants={item}>
            <SectionHeader
              eyebrow="Achievements"
              title="Milestones & growth."
              description="Key markers of my growth as an engineer and product builder."
              accentUnderline
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {achievementsList.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
