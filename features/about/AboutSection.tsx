"use client";

import { motion, type Variants } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { personal } from "@/data/personal";
import type { PersonalInfo } from "@/types";
import { GraduationCap, Briefcase, Code2, Sparkles, Building2, Heart } from "lucide-react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, type: "tween" },
  },
};

const quickFacts = [
  { icon: GraduationCap, label: "Education", value: "MCA Graduate · BCA Graduate" },
  { icon: Code2, label: "Expertise", value: "Full Stack Development · Java · React" },
  { icon: Building2, label: "Domain", value: "Insurance & Operations" },
  { icon: Briefcase, label: "Experience", value: "Operations Executive · Freelance Developer" },
  { icon: Sparkles, label: "Focus", value: "Product Engineering · SaaS · AI Applications" },
  { icon: Heart, label: "Driven By", value: "Solving real problems at scale" },
];

export function AboutSection({ personalInfo = personal }: { personalInfo?: PersonalInfo }) {
  return (
    <section id="about" className="py-[72px] bg-surface border-t border-border-base">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div variants={item}>
            <SectionHeader
              eyebrow="About"
              title="The story so far."
              description="From operations floors to production deployments — my path has been unconventional and that's exactly the point."
              accentUnderline
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Story */}
            <div className="space-y-5">
              {personalInfo.bio.split("\n\n").map((paragraph, i) => (
                <motion.p
                  key={i}
                  variants={item}
                  className="text-foreground-muted leading-[1.75] text-[0.9875rem]"
                >
                  {paragraph}
                </motion.p>
              ))}

              <motion.div variants={item} className="pt-4">
                <p className="text-xs font-bold text-foreground-faint mb-3 uppercase tracking-widest">
                  What sets me apart
                </p>
                <ul className="space-y-2">
                  {[
                    "Business-first thinking — I understand workflows before writing code",
                    "Operations experience that informs product decisions",
                    "End-to-end ownership from architecture to deployment",
                    "Built 5+ production systems independently",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Quick Facts */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickFacts.map((fact, i) => (
                <div
                  key={i}
                  className="group p-4 rounded-xl border border-border-base bg-muted hover:bg-card hover:border-blue-600 dark:hover:border-blue-500 hover:-translate-y-[2px] hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)] transition-all duration-[220ms]"
                >
                  <fact.icon size={16} className="text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-xs text-foreground-faint font-bold mb-1 uppercase tracking-wider">
                    {fact.label}
                  </p>
                  <p className="text-sm text-foreground-muted font-medium leading-snug">
                    {fact.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
