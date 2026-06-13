"use client";

import { motion, type Variants } from "framer-motion";
import { experiences } from "@/data/experience";
import type { Experience } from "@/types";
import { cn } from "@/lib/utils";
import {
  Target,
  Clock,
  TrendingUp,
  Users,
  Shield,
  Zap,
  CheckCircle,
  ShieldCheck,
  Layers,
  MessageSquare,
  BarChart,
  Heart,
  Check,
  Briefcase
} from "lucide-react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, type: "tween" } },
};

const getHighlightInfo = (label: string) => {
  const map: Record<string, { icon: any; description: string }> = {
    "High Accuracy": { icon: Target, description: "Precision in policy reviews" },
    "Timely Delivery": { icon: Clock, description: "SLA compliance" },
    "Process Improvement": { icon: TrendingUp, description: "Optimized workflows" },
    "Cross-team Collaboration": { icon: Users, description: "Worked across teams" },
    "Confidentiality": { icon: Shield, description: "Strict data privacy" },
    "Performance Focused": { icon: Zap, description: "Achieved KPI targets" },
    "Data Accuracy": { icon: CheckCircle, description: "High quality standards" },
    "SLA Compliance": { icon: ShieldCheck, description: "Met turnaround times" },
    "Multi-tasking": { icon: Layers, description: "Managed multiple priorities" },
    "Communication": { icon: MessageSquare, description: "Clear client support" },
    "Analytical Skills": { icon: BarChart, description: "Data validation" },
    "Client Focused": { icon: Heart, description: "Excellent service" },
  };
  
  return map[label] || { icon: CheckCircle, description: "Key achievement" };
};

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <motion.div
      variants={item}
      className="group relative bg-card border border-border-base rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] transition-all duration-300"
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
              <Briefcase className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground leading-tight">{exp.role}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{exp.company}</span>
                {exp.domain && (
                  <>
                    <span className="text-foreground-muted/50 hidden sm:inline" aria-hidden="true">•</span>
                    <span className="text-sm font-medium text-foreground-muted bg-surface px-2 py-0.5 rounded-md border border-border-base">{exp.domain}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-2.5">
            <span
              className={cn(
                "inline-flex w-fit text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider",
                "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
              )}
            >
              {exp.type === "full-time" ? "Full-Time" : exp.type}
            </span>
            <span className="text-sm text-foreground-faint font-mono font-medium">
              <time>{exp.startDate}</time> – <time>{exp.endDate}</time>
            </span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 md:gap-12">
          {/* Left Column: Responsibilities */}
          <div>
            <h4 className="text-xs font-bold text-foreground-faint uppercase tracking-widest mb-4 flex items-center gap-2">
              Key Responsibilities
            </h4>
            <ul className="space-y-4" aria-label={`Responsibilities as ${exp.role}`}>
              {exp.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-3 group/item">
                  <div className="mt-1 shrink-0 p-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 transition-colors group-hover/item:bg-blue-500 group-hover/item:text-white group-hover/item:border-blue-500 dark:group-hover/item:bg-blue-500 dark:group-hover/item:border-blue-500">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" />
                  </div>
                  <span className="text-sm md:text-base text-foreground-muted leading-relaxed">
                    {resp}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Highlights Grid */}
          {exp.highlights && exp.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-foreground-faint uppercase tracking-widest mb-4 flex items-center gap-2">
                Key Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
                {exp.highlights.map((highlight, i) => {
                  const { icon: Icon, description } = getHighlightInfo(highlight);
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-surface border border-border-base group-hover:border-blue-500/30 transition-colors flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shrink-0">
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <span className="text-sm font-bold text-foreground leading-tight">{highlight}</span>
                      </div>
                      <p className="text-xs text-foreground-muted leading-snug pl-9">
                        {description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceSection({ experiences: experiencesList = experiences }: { experiences?: Experience[] }) {
  return (
    <section id="experience" className="py-24 bg-surface border-t border-border-base" aria-label="Work Experience">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          {/* Section Header */}
          <motion.div variants={item} className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" aria-hidden="true" />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                EXPERIENCE
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
              Where I've worked.
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl leading-relaxed">
              A blend of professional operations experience and dedicated client support, ensuring high-quality service, compliance, and impactful results.
            </p>
          </motion.div>

          <div className="space-y-6">
            {experiencesList.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
