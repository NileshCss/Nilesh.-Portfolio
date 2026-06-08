import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { getPortfolioData } from "@/lib/supabase/portfolio";
import { blogPosts } from "../page";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, BookOpen } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const data = await getPortfolioData();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6 max-w-[800px] mx-auto font-sans text-slate-800 dark:text-slate-200">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Article Header */}
        <article className="relative">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-600/[0.04] rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/15">
              {post.category}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-outfit, sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
            }}
            className="text-slate-900 dark:text-white mb-6"
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-slate-400 mb-10 pb-6 border-b border-slate-100 dark:border-slate-900">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {post.readTime}
            </span>
          </div>

          {/* Article Content */}
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-base space-y-6">
            <p className="text-lg text-slate-700 dark:text-slate-300 font-medium italic">
              {post.excerpt}
            </p>
            <p>
              In modern software architecture, managing complexity and scalability is a critical challenge. Whether building enterprise SaaS platforms, AI-powered applications, or complex microservices, it is vital to adhere to established design principles, robust validation schemas, and high-performance databases.
            </p>
            <h3
              style={{
                fontFamily: "var(--font-outfit, sans-serif)",
                fontWeight: 800,
                fontSize: "1.3rem",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
              className="text-slate-900 dark:text-white"
            >
              Key Architectures and Patterns
            </h3>
            <p>
              Structuring components into logical, single-responsibility layers is a key best practice. On the backend, Spring Boot and microservices offer rich patterns like discovery services (Eureka), centralized configuration, api gateways, and distributed logging. Combining these with relational database schemas that enforce proper indexes and Row-Level Security (RLS) policies ensures data integrity and security at the core.
            </p>
            <p>
              On the frontend, single-page routing structures, server components by default, and responsive styling systems provide excellent performance and high accessibility (a11y).
            </p>
            <div className="my-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 flex gap-4">
              <BookOpen size={24} className="text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Takeaway</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Investing time in planning folder structure, security patterns, and performance metrics pays off in long-term maintainability and UX quality.
                </p>
              </div>
            </div>
            <p>
              We will explore more specifics of this implementation, including authentication flows with Next.js middleware and Supabase JWT tokens, in subsequent logs. Stay tuned!
            </p>
          </div>
        </article>
      </main>
      <Footer personalInfo={data.personalInfo} />
      <BackToTop />
    </>
  );
}
