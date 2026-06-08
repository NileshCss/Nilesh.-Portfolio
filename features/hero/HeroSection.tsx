"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Download, GraduationCap, Code2, Star, Smile, Mail, MapPin, Briefcase, Clock, Layers, CheckCircle2 } from "lucide-react";
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

export function HeroSection({ personalInfo = personal }: { personalInfo?: PersonalInfo }) {
  const statCells = [
    { icon: Clock, value: "2+", label: "Years Professional Experience", color: "text-blue-600" },
    { icon: Code2, value: "5+", label: "Projects Completed", color: "text-blue-600" },
    { icon: Star, value: personalInfo.role.split(" ").slice(-2).join(" ") || "Developer", label: "Specialty", color: "text-blue-600" },
    { icon: Smile, value: personalInfo.openToWork ? "Open To Work" : "Unavailable", label: "Status", color: personalInfo.openToWork ? "text-emerald-500" : "text-slate-400", valueColor: personalInfo.openToWork ? "text-emerald-500" : "text-slate-400" },
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
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-12 lg:gap-16 items-start">
          {/* ── LEFT COLUMN: HERO CONTENT (70%) ── */}
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

            {/* Description (Short Introduction) */}
            <motion.p
              variants={item}
              className="text-[0.9875rem] text-slate-500 leading-[1.75] max-w-[540px] mb-8"
            >
              {personalInfo.bio.split("\n\n")[0]}
            </motion.p>

            {/* Call To Action Buttons */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-6">
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 px-[22px] py-3 bg-slate-900 text-white text-[0.9375rem] font-semibold rounded-lg hover:bg-slate-800 hover:-translate-y-px transition-all duration-200 shadow-sm"
              >
                View Projects
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-[11px] bg-white text-slate-900 text-[0.9375rem] font-semibold rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm"
              >
                <Mail size={15} className="text-slate-500" />
                Contact Me
              </Link>
              {personalInfo.resumeUrl && (
                <Link
                  href={personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-[11px] bg-white text-slate-900 text-[0.9375rem] font-semibold rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm"
                >
                  <Download size={15} className="text-slate-500" />
                  Resume
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
              className="grid grid-cols-2 sm:grid-cols-4 rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              {statCells.map((cell, i) => (
               <div
                  key={i}
                  className="px-4 py-[16px] flex flex-col justify-center gap-1 hover:bg-slate-50 transition-colors duration-200 border-r border-slate-200 last:border-r-0 border-b sm:border-b-0"
                  style={i >= 2 ? { borderBottom: "none" } : undefined}
                >
                  <div className="flex items-center gap-2">
                    <cell.icon size={15} className={cell.color} />
                    <p className={`text-[1rem] font-bold ${cell.valueColor ?? "text-slate-900"} leading-none`}>
                      {cell.value}
                    </p>
                  </div>
                  <p className="text-[0.75rem] text-slate-500 font-medium leading-snug">{cell.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN: INFORMATION SIDEBAR (30%) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "tween" }}
            className="flex flex-col gap-5 lg:mt-2"
          >
            {/* Contact Information Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h3 className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider mb-4">
                <Briefcase size={14} /> Contact & Status
              </h3>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.75rem] text-slate-400 font-medium">Email</p>
                    <p className="text-[0.875rem] text-slate-900 font-semibold truncate">{personalInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.75rem] text-slate-400 font-medium">Location</p>
                    <p className="text-[0.875rem] text-slate-900 font-semibold truncate">Bengaluru, India</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.75rem] text-slate-400 font-medium">Availability</p>
                    <p className="text-[0.875rem] text-emerald-600 font-semibold truncate">Open To Work</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h3 className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider mb-4">
                <Layers size={14} /> Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Java", "Spring Boot", "React", "Next.js", "TypeScript", "PostgreSQL"].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[0.75rem] font-semibold text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Education Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h3 className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider mb-4">
                <GraduationCap size={14} /> Education
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[0.875rem] text-slate-900 font-bold">MCA</p>
                  <p className="text-[0.8rem] text-slate-500 font-medium line-clamp-2 leading-snug mt-0.5">
                    Acharya Institute of Graduate Studies
                  </p>
                </div>
                <div>
                  <p className="text-[0.875rem] text-slate-900 font-bold">BCA</p>
                  <p className="text-[0.8rem] text-slate-500 font-medium line-clamp-2 leading-snug mt-0.5">
                    St. Columba&apos;s College
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
