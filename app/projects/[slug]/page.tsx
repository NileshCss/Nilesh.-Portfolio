import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPortfolioData } from "@/lib/supabase/portfolio";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch, Shield, Zap } from "lucide-react";

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const portfolioData = await getPortfolioData();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) {
    notFound();
  }

  const techStack: string[] = project.tech_stack ?? [];
  const features: string[] = project.features ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6 max-w-[1200px] mx-auto font-sans text-slate-800 dark:text-slate-200">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        {/* Hero Area */}
        <div className="relative mb-12">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-600/[0.04] dark:bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-600/[0.03] dark:bg-purple-500/[0.01] rounded-full blur-[120px] pointer-events-none" />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/15">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/15">
              {project.status}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-outfit, sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
            className="text-slate-900 dark:text-white mb-4"
          >
            {project.title}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-[800px] leading-relaxed">
            {project.tagline}
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 mb-16">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            >
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 text-sm font-semibold hover:-translate-y-px transition-all duration-200"
            >
              <GitBranch size={16} /> Source Code
            </a>
          )}
        </div>

        {/* Case Study Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2
                style={{
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  letterSpacing: "-0.03em",
                }}
                className="text-slate-900 dark:text-white mb-4"
              >
                Project Overview
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                {project.description.split("\n\n").map((para: string, idx: number) => (
                  <p key={idx} className="mb-4">{para}</p>
                ))}
              </div>
            </section>

            {/* Key Features */}
            {features.length > 0 && (
              <section>
                <h2
                  style={{
                    fontFamily: "var(--font-outfit, sans-serif)",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    letterSpacing: "-0.03em",
                  }}
                  className="text-slate-900 dark:text-white mb-5"
                >
                  Key Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/[0.3] dark:bg-slate-900/[0.2] flex items-start gap-3"
                    >
                      <Zap size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Tech Stack */}
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/[0.3] dark:bg-slate-900/[0.2]">
              <h3
                style={{
                  fontFamily: "var(--font-outfit, sans-serif)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
                className="text-slate-900 dark:text-white mb-4"
              >
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-blue-500 bg-blue-500/10 border border-blue-500/15"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Challenges & Impact */}
            {(project.challenge || project.business_impact) && (
              <div className="space-y-6">
                {project.challenge && (
                  <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/[0.3] dark:bg-slate-900/[0.2]">
                    <h3
                      style={{
                        fontFamily: "var(--font-outfit, sans-serif)",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                      className="text-slate-900 dark:text-white mb-3 flex items-center gap-2"
                    >
                      <Shield size={16} className="text-amber-500" />
                      The Challenge
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                )}

                {project.business_impact && (
                  <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/[0.3] dark:bg-slate-900/[0.2]">
                    <h3
                      style={{
                        fontFamily: "var(--font-outfit, sans-serif)",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                      className="text-slate-900 dark:text-white mb-3 flex items-center gap-2"
                    >
                      <Zap size={16} className="text-emerald-500" />
                      Business Impact
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {project.business_impact}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer personalInfo={portfolioData.personalInfo} />
      <BackToTop />
    </>
  );
}
