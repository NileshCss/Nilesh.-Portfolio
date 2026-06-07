"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

const cardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, type: "tween" } },
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={cardItem}
      className="group flex flex-col bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-600 hover:-translate-y-[3px] hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)] transition-all duration-[220ms]"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[1rem] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        {/* Green live dot */}
        <span
          className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
          style={{ boxShadow: "0 0 0 3px rgba(16,185,129,0.2)" }}
        />
      </div>

      {/* Category */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {project.category}
      </p>

      {/* Description */}
      <p className="text-[0.875rem] text-slate-500 leading-[1.6] mb-4 flex-1">
        {project.description}
      </p>

      {/* Tech stack pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[0.72rem] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded px-2 py-0.5"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 mt-auto">
        {project.githubUrl && (
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            <GitHubIcon size={14} />
            GitHub
          </Link>
        )}
        {project.liveUrl ? (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[0.8375rem] font-semibold text-blue-600 hover:gap-2 transition-all"
          >
            Live Demo
            <ExternalLink size={13} />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 text-[0.8375rem] font-semibold text-blue-600 hover:gap-2 transition-all cursor-default opacity-50">
            Coming Soon
          </span>
        )}
      </div>
    </motion.article>
  );
}
