"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sun, Moon, Rocket } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function ProjectsSection({ projects: projectsList }: ProjectsSectionProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? (resolvedTheme === "dark" || theme === "dark") : true;
  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const featuredProjects = projectsList.filter((p) => p.isFeatured);
  const smallProjects = projectsList.filter((p) => !p.isFeatured);

  // Styled color tokens matching specs
  const textMutedClass = "text-[#475569] dark:text-[#94a3b8]";
  const btnSecondaryClass = "border-[#cbd5e1] dark:border-[#2e2e3e] text-[#475569] dark:text-[#cbd5e1] hover:border-[#0f172a] dark:hover:border-white hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-transparent transition-all";

  return (
    <section
      id="projects"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] dark:bg-[#0a0a0f] text-[#0f172a] dark:text-[#f8fafc] transition-colors duration-300 overflow-x-hidden"
    >
      {/* Floating Toggle Button (visible top right on mobile fixed, or absolute on larger viewports) */}
      {mounted && (
        <div className="fixed sm:absolute top-4 right-4 z-50">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-300 active:scale-95 shadow-md bg-white border-[#cbd5e1] text-[#0f172a] hover:bg-[#f1f5f9] dark:bg-[#111118] dark:border-[#1e1e2e] dark:text-[#f8fafc] dark:hover:bg-[#1a1a25] dark:hover:border-[#3b82f6]"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* =========================================================================
                                       HEADER ROW
             ========================================================================= */}
          <motion.header
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div className="max-w-3xl">
              {/* Eyebrow Label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] inline-block"></span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#3b82f6]">
                  SELECTED WORK
                </span>
              </div>

              {/* Title */}
              <h2
                style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)" }}
                className="font-extrabold tracking-tight leading-none mb-4"
              >
                Projects I'm Proud Of
              </h2>

              {/* Subtitle */}
              <p
                style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
                className={`${textMutedClass} leading-relaxed`}
              >
                A selection of projects that reflect my passion for coding, problem-solving, and building impactful digital products.
              </p>
            </div>

            {/* View All Projects Action */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <a
                href="https://github.com/rajputnileshsingh25?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border text-sm font-semibold w-full md:w-auto text-center ${btnSecondaryClass}`}
              >
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.header>

          {/* =========================================================================
                                   TOP ROW - 2 FEATURED CARDS
             ========================================================================= */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16"
          >
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isFeatured={true} />
            ))}
          </motion.div>

          {/* =========================================================================
                                   BOTTOM ROW - 4 SMALL CARDS
             ========================================================================= */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16"
          >
            {smallProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isFeatured={false} />
            ))}
          </motion.div>

          {/* =========================================================================
                                       BOTTOM CTA BANNER
             ========================================================================= */}
          <motion.section
            variants={itemVariants}
            className="rounded-3xl border p-6 sm:p-8 md:p-10 transition-colors duration-300 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-white to-slate-50 border-[#e2e8f0] shadow-sm dark:from-[#111118] dark:to-[#161622] dark:border-[#1e1e2e]"
          >
            <div className="flex items-center gap-4 text-center md:text-left">
              <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#3b82f6]/10 text-[#3b82f6]">
                <Rocket className="w-6 h-6 animate-bounce" style={{ animationDuration: "3s" }} />
              </span>
              <p className="font-semibold text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                I love building products that solve real-world problems and create meaningful impact.
              </p>
            </div>
            <a
              href="https://github.com/rajputnileshsingh25?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-[#3b82f6] hover:bg-[#2563eb] hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-all duration-200 hover:-translate-y-0.5 w-full md:w-auto text-center"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.section>
        </motion.div>
      </div>
    </section>
  );
}
