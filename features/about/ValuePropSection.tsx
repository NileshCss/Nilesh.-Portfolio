"use client";

import { motion, type Variants } from "framer-motion";
import { Clock, Monitor, PenLine } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, type: "tween" } },
};

const cards = [
  {
    icon: Clock,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Product Thinking",
    desc: "I focus on solving real business problems and creating solutions that make a difference.",
  },
  {
    icon: Monitor,
    iconBg: "bg-green-50",
    iconColor: "text-emerald-500",
    title: "Full Stack Capability",
    desc: "From frontend to backend, database to deployment — I build complete products end to end.",
  },
  {
    icon: PenLine,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Continuous Learning",
    desc: "I stay updated with modern technologies, AI tools, and industry best practices to deliver high-quality solutions.",
  },
];

export function ValuePropSection() {
  return (
    <section id="why-work-with-me" className="py-[72px] bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          {/* Header */}
          <motion.div variants={item} className="text-center mb-12">
            <SectionHeader
              eyebrow="Why Work With Me"
              title="I don't just write code, I solve problems."
              align="center"
              accentUnderline
            />
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                variants={item}
                className="group bg-white border border-slate-200 rounded-2xl p-7 hover:border-blue-600 hover:-translate-y-[3px] hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)] transition-all duration-[220ms]"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.iconBg}`}>
                  <card.icon size={20} className={card.iconColor} />
                </div>
                <h3 className="text-[1rem] font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-[0.9rem] text-slate-500 leading-[1.65]">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
