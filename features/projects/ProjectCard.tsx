"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ExternalLink, Check } from "lucide-react";
import type { Project } from "@/types";

function Github({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

interface ProjectCardProps {
  project: Project;
  isFeatured?: boolean;
}

interface ProjectMeta {
  image: string;
  gradient: string;
  caseStudyUrl: string;
}

// Map project IDs to fallback gradient colors (used when no image uploaded yet)
const getProjectMeta = (id: string, title: string): ProjectMeta => {
  const normalizedId = id.toLowerCase();
  const normalizedTitle = title.toLowerCase();

  if (normalizedId.includes("vacancy") || normalizedTitle.includes("vacancy")) {
    return { image: "", gradient: "from-blue-600/30 to-indigo-900/40", caseStudyUrl: "https://github.com/rajputnileshsingh25/nv-newvacancy/blob/main/README.md" };
  }
  if (normalizedId.includes("pg") || normalizedTitle.includes("pg") || normalizedTitle.includes("hostel")) {
    return { image: "", gradient: "from-purple-600/30 to-pink-900/40", caseStudyUrl: "https://github.com/rajputnileshsingh25/pg-management-saas/blob/main/README.md" };
  }
  if (normalizedId.includes("moksha") || normalizedTitle.includes("moksha")) {
    return { image: "", gradient: "from-violet-800/30 to-slate-900/40", caseStudyUrl: "https://github.com/rajputnileshsingh25/moksha-sphere/blob/main/README.md" };
  }
  if (normalizedId.includes("gramin") || normalizedTitle.includes("gramin") || normalizedTitle.includes("samasya")) {
    return { image: "", gradient: "from-orange-600/30 to-amber-900/40", caseStudyUrl: "https://github.com/rajputnileshsingh25/gramin-samasya/blob/main/README.md" };
  }
  if (normalizedId.includes("village") || normalizedTitle.includes("village") || normalizedTitle.includes("connect")) {
    return { image: "", gradient: "from-emerald-700/30 to-teal-950/40", caseStudyUrl: "https://github.com/rajputnileshsingh25/village-connect/blob/main/README.md" };
  }
  if (normalizedId.includes("fitness") || normalizedTitle.includes("fitness") || normalizedTitle.includes("hub")) {
    return { image: "", gradient: "from-cyan-600/30 to-teal-900/40", caseStudyUrl: "https://github.com/rajputnileshsingh25/fitness-hub/blob/main/README.md" };
  }
  return { image: "", gradient: "from-slate-700/30 to-slate-900/40", caseStudyUrl: "#" };
};

const ProjectImage = ({ src, alt, fallbackGradient }: { src: string; alt: string; fallbackGradient: string }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${fallbackGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="text-center z-10 px-4">
          <span className="text-white/20 font-black text-3xl tracking-widest block uppercase font-sans mb-1">
            {alt.slice(0, 2)}
          </span>
          <span className="text-white/40 text-[9px] uppercase font-mono tracking-wider">
            No Preview Yet
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
  );
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, type: "tween" } },
};

export function ProjectCard({ project, isFeatured = false }: ProjectCardProps) {
  const meta = getProjectMeta(project.id, project.title);
  const imageUrl = project.previewImageUrl || meta.image;

  // Styling token classes matching dark/light mode specifications
  const cardBorderClass = "border-[#e2e8f0] dark:border-[#1e1e2e] hover:border-[#3b82f6]/30 dark:hover:border-[#3b82f6]/50";
  const cardBgClass = "bg-white dark:bg-[#111118] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]";
  const textTitleClass = "text-[#0f172a] dark:text-[#f8fafc] group-hover:text-[#3b82f6] transition-colors";
  const textMutedClass = "text-[#475569] dark:text-[#94a3b8]";
  
  const pillClass = "bg-[#e2e8f0] dark:bg-[#1a1a24] text-[#334155] dark:text-[#94a3b8] border-transparent dark:border-[#2e2e3e] hover:bg-[#cbd5e1] dark:hover:bg-[#252535] hover:text-[#0f172a] dark:hover:text-[#f8fafc]";
  const btnSecondaryClass = "border-[#cbd5e1] dark:border-[#2e2e3e] text-[#475569] dark:text-[#cbd5e1] hover:border-[#0f172a] dark:hover:border-white hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-transparent dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]";

  if (isFeatured) {
    return (
      <motion.article
        variants={cardItem}
        className={`group flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 ${cardBgClass} ${cardBorderClass}`}
      >
        {/* Preview image 16:9 */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-inherit">
          {/* Featured Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/20">
              ⭐ FEATURED
            </span>
          </div>

          {/* Live Badge with Pulse */}
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE
            </span>
          </div>

          <ProjectImage src={imageUrl} alt={project.title} fallbackGradient={meta.gradient} />
        </div>

        {/* Content Details */}
        <div className="p-5 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3b82f6] block mb-2">
              {project.category}
            </span>

            <h3 className={`text-xl sm:text-2xl font-bold tracking-tight mb-3 ${textTitleClass}`}>
              {project.title}
            </h3>

            <p className={`${textMutedClass} text-sm leading-relaxed mb-6`}>
              {project.description}
            </p>

            {project.features && project.features.length > 0 && (
              <ul className="grid grid-cols-1 gap-2.5 mb-8">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[#334155] dark:text-[#e2e8f0]">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tech pills and CTAs */}
          <div>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className={`text-[10px] font-bold tracking-wider uppercase font-mono px-3 py-1 rounded-lg border transition-colors ${pillClass}`}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-200 flex-1 hover:-translate-y-0.5 ${btnSecondaryClass}`}
                >
                  <Github size={15} />
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white bg-[#3b82f6] hover:bg-[#2563eb] hover:shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all duration-200 flex-1 hover:-translate-y-0.5"
                >
                  <ExternalLink size={15} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Small Project Card Layout
  return (
    <motion.article
      variants={cardItem}
      className={`group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 ${cardBgClass} ${cardBorderClass}`}
    >
      {/* Banner image with responsive height */}
      <div className="relative w-full h-[120px] sm:h-[130px] lg:h-[140px] overflow-hidden bg-slate-900 border-b border-inherit">
        {/* Live Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            LIVE
          </span>
        </div>

        <ProjectImage src={imageUrl} alt={project.title} fallbackGradient={meta.gradient} />
      </div>

      {/* Card Body content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#3b82f6] block mb-1">
            {project.category}
          </span>

          <h4 className={`text-base font-bold tracking-tight mb-2 ${textTitleClass}`}>
            {project.title}
          </h4>

          <p className={`${textMutedClass} text-xs leading-relaxed mb-4 line-clamp-2`}>
            {project.description}
          </p>
        </div>

        <div>
          {/* Stack pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className={`text-[9px] font-bold tracking-wide uppercase font-mono px-2 py-0.5 rounded border transition-colors ${pillClass}`}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex gap-1.5 w-full">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-[10px] font-bold transition-all duration-200 flex-1 hover:-translate-y-0.5 ${btnSecondaryClass}`}
              >
                <Github size={13} />
                Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[10px] font-bold text-white bg-[#3b82f6] hover:bg-[#2563eb] hover:shadow-[0_2px_8px_rgba(59,130,246,0.3)] transition-all duration-200 flex-1 hover:-translate-y-0.5"
              >
                <ExternalLink size={13} />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
