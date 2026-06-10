"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCard } from "./ProjectCard";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const headerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, type: "tween" } },
};

export function ProjectsSection({ projects: projectsList = projects }: { projects?: Project[] }) {
  return (
    <section id="projects" className="py-[72px] bg-surface border-t border-border-base">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          {/* Section header row */}
          <motion.div
            variants={headerItem}
            className="flex flex-wrap items-end justify-between gap-4 mb-10"
          >
            <SectionHeader
              eyebrow="Selected Work"
              title="Projects I'm Proud Of"
              className="mb-0"
            />
            <Link
              href="#contact"
              className="group inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all duration-200 mb-2"
            >
              View All Projects
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* 3-column grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectsList.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
