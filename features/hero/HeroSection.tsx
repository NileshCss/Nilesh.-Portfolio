"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Download, Calendar, GraduationCap, Code2, Star, Smile, Mail, MapPin, Briefcase, Clock } from "lucide-react";
import { personal } from "@/data/personal";
import type { PersonalInfo } from "@/types";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, type: "tween" } },
};

const statCells = [
  { icon: GraduationCap, value: "MCA Graduate", label: "Post Graduate", color: "text-blue-600" },
  { icon: Code2, value: "5+", label: "Projects Completed", color: "text-blue-600" },
  { icon: Star, value: "Full Stack", label: "Java Developer", color: "text-blue-600" },
  { icon: Smile, value: "Open To Work", label: "Opportunities", color: "text-emerald-500", valueColor: "text-emerald-500" },
];

const sidebarRows = [
  {
    icon: Mail,
    label: "Email",
    value: personal.email,
    valueSize: "text-[0.8rem]",
    iconBg: "bg-white border-slate-200 text-slate-500",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Bihar, India",
    iconBg: "bg-white border-slate-200 text-slate-500",
  },
  {
    icon: Briefcase,
    label: "Availability",
    value: "Open To Work",
    valueColor: "text-emerald-500",
    iconBg: "bg-green-50 border-emerald-200 text-emerald-500",
  },
  {
    icon: Clock,
    label: "Experience",
    value: "1+ Year",
    iconBg: "bg-white border-slate-200 text-slate-500",
  },
  {
    icon: GraduationCap,
    label: "Education",
    value: "MCA Graduate",
    iconBg: "bg-white border-slate-200 text-slate-500",
  },
];

export function HeroSection({ personalInfo = personal }: { personalInfo?: PersonalInfo }) {
  const statCells = [
    { icon: GraduationCap, value: personalInfo.shortBio.split(" · ")[0] || "MCA Graduate", label: "Education", color: "text-blue-600" },
    { icon: Code2, value: "5+", label: "Projects Completed", color: "text-blue-600" },
    { icon: Star, value: personalInfo.role.split(" ").slice(-2).join(" ") || "Developer", label: "Specialty", color: "text-blue-600" },
    { icon: Smile, value: personalInfo.openToWork ? "Open To Work" : "Unavailable", label: "Status", color: personalInfo.openToWork ? "text-emerald-500" : "text-slate-400", valueColor: personalInfo.openToWork ? "text-emerald-500" : "text-slate-400" },
  ];

  const sidebarRows = [
    {
      icon: Mail,
      label: "Email",
      value: personalInfo.email,
      valueSize: "text-[0.8rem]",
      iconBg: "bg-white border-slate-200 text-slate-500",
    },
    {
      icon: MapPin,
      label: "Location",
      value: personalInfo.location || "India",
      iconBg: "bg-white border-slate-200 text-slate-500",
    },
    {
      icon: Briefcase,
      label: "Availability",
      value: personalInfo.openToWork ? "Open To Work" : "Unavailable",
      valueColor: personalInfo.openToWork ? "text-emerald-500" : "text-slate-400",
      iconBg: personalInfo.openToWork ? "bg-green-50 border-emerald-200 text-emerald-500" : "bg-slate-50 border-slate-200 text-slate-400",
    },
    {
      icon: Clock,
      label: "Experience",
      value: "1+ Year",
      iconBg: "bg-white border-slate-200 text-slate-500",
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: personalInfo.shortBio.split(" · ")[0] || "MCA Graduate",
      iconBg: "bg-white border-slate-200 text-slate-500",
    },
  ];

  return (
    <section
      id="home"
      className="relative pt-[110px] pb-[72px] bg-white overflow-hidden"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #E2E8F0 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.45,
        }}
      />
      {/* Blue glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 30% 50%, rgba(37,99,235,0.055) 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 items-start">
          {/* LEFT COLUMN */}
          <motion.div initial="hidden" animate="visible" variants={container}>
            {/* Eyebrow */}
            <motion.div variants={item} className="flex items-center gap-2 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[0.8rem] font-bold text-blue-600 uppercase tracking-[0.1em]">
                {personalInfo.role}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={item}
              className="font-black text-slate-900 leading-[1.05] mb-5"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.75rem)",
                letterSpacing: "-0.05em",
              }}
            >
              {personalInfo.name}
              <span className="text-blue-600">.</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={item}
              className="font-medium text-slate-500 leading-[1.55] mb-5 max-w-[540px]"
              style={{ fontSize: "clamp(1.125rem, 2.2vw, 1.375rem)" }}
            >
              {personalInfo.tagline}
            </motion.p>

            {/* Description */}
            <motion.p
              variants={item}
              className="text-[0.9875rem] text-slate-500 leading-[1.75] max-w-[520px] mb-8"
            >
              {personalInfo.bio.split("\n\n")[0]}
            </motion.p>

            {/* Buttons */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-2.5 mb-4">
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 px-[22px] py-3 bg-blue-600 text-white text-[0.9375rem] font-semibold rounded-lg hover:bg-blue-500 hover:-translate-y-px transition-all duration-200 shadow-sm"
              >
                View Projects
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => (window as Window & { openConnectModal?: () => void }).openConnectModal?.()}
                className="inline-flex items-center gap-2 px-5 py-[11px] bg-white text-slate-900 text-[0.9375rem] font-semibold rounded-lg border border-[#CBD5E1] hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                <Calendar size={15} />
                Schedule Meeting
              </button>
              {personalInfo.resumeUrl && (
                <Link
                  href={personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-[11px] bg-white text-slate-900 text-[0.9375rem] font-semibold rounded-lg border border-[#CBD5E1] hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                >
                  <Download size={15} />
                  Download Resume
                </Link>
              )}
            </motion.div>

            {/* Footnote */}
            <motion.p variants={item} className="text-[0.8375rem] text-slate-400 mb-10">
              Let&apos;s build something meaningful together.
            </motion.p>

            {/* Stats bar */}
            <motion.div
              variants={item}
              className="grid grid-cols-2 sm:grid-cols-4 rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              {statCells.map((cell, i) => (
                <div
                  key={i}
                  className="px-4 py-[18px] flex items-start gap-3 hover:bg-slate-50 transition-colors duration-200 border-r border-slate-200 last:border-r-0"
                >
                  <cell.icon size={18} className={`mt-0.5 shrink-0 ${cell.color}`} />
                  <div>
                    <p className={`text-[0.9375rem] font-bold ${cell.valueColor ?? "text-slate-900"} leading-tight`}>
                      {cell.value}
                    </p>
                    <p className="text-[0.75rem] text-slate-400 mt-0.5">{cell.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN — Sidebar Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "tween" }}
            className="lg:mt-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            {sidebarRows.map((row, i) => (
              <div
                key={i}
                className={`flex items-start gap-3.5 px-5 py-4 hover:bg-white transition-colors duration-200 ${
                  i < sidebarRows.length - 1 ? "border-b border-slate-200" : ""
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-lg border ${row.iconBg}`}
                >
                  <row.icon size={15} />
                </div>
                {/* Text */}
                <div>
                  <p className="text-[0.75rem] font-medium text-slate-400 mb-0.5">{row.label}</p>
                  <p className={`text-[0.875rem] font-semibold ${row.valueColor ?? "text-slate-900"} ${row.valueSize ?? ""} break-all`}>
                    {row.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
