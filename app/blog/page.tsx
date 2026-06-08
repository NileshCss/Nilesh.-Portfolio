import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { getPortfolioData } from "@/lib/supabase/portfolio";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "scalable-spring-boot-architecture",
    title: "Building Scalable Microservices with Spring Boot and Spring Cloud",
    excerpt: "Learn the core design patterns and best practices for creating resilient, distributed, and highly available Java microservices.",
    category: "Backend Development",
    date: "Jun 1, 2026",
    readTime: "8 min read",
  },
  {
    slug: "next-js-supabase-auth-guide",
    title: "The Ultimate Guide to Next.js App Router and Supabase Authentication",
    excerpt: "Secure your modern Next.js SaaS platforms using Supabase Auth, middleware protection, and server components seamlessly.",
    category: "Web Development",
    date: "May 25, 2026",
    readTime: "6 min read",
  },
  {
    slug: "vector-databases-for-llm-apps",
    title: "Vector Databases: Choosing Between pgvector, Pinecone, and Chroma for LLMs",
    excerpt: "An in-depth analysis of semantic search architectures and how to store multi-dimensional embeddings for RAG systems.",
    category: "Artificial Intelligence",
    date: "May 10, 2026",
    readTime: "10 min read",
  },
  {
    slug: "postgresql-query-optimization",
    title: "PostgreSQL Query Optimization: Indexes, EXPLAIN ANALYZE, and RLS",
    excerpt: "How to audit slow database requests, write performant SQL indexes, and structure row-level security without sacrificing execution speed.",
    category: "Database Design",
    date: "Apr 28, 2026",
    readTime: "7 min read",
  },
];

export default async function BlogPage() {
  const data = await getPortfolioData();
  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6 max-w-[1200px] mx-auto font-sans text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="relative mb-16 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/[0.04] rounded-full blur-[100px] pointer-events-none" />
          
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/15 px-3.5 py-1.5 rounded-full inline-block mb-4">
            My Journal
          </span>
          <h1
            style={{
              fontFamily: "var(--font-outfit, sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              letterSpacing: "-0.04em",
            }}
            className="text-slate-900 dark:text-white mb-4"
          >
            Insights & Engineering Notes
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-[600px] mx-auto leading-relaxed">
            Articles, tutorials, and tech write-ups about Java, Spring Boot, Next.js, databases, and AI engineering.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/[0.3] dark:bg-slate-900/[0.2] p-8 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Left: Metadata & Text */}
                  <div className="space-y-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/15">
                      Featured · {featuredPost.category}
                    </span>
                    <h2
                      style={{
                        fontFamily: "var(--font-outfit, sans-serif)",
                        fontWeight: 800,
                        fontSize: "clamp(1.5rem, 3vw, 2rem)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.2,
                      }}
                      className="text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {featuredPost.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Right: Premium Placeholder visual */}
                  <div className="h-64 rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                    <span className="text-sm font-mono font-semibold text-blue-500 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg">
                      &lt; Engineering Log /&gt;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group block">
              <div className="h-full rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/[0.3] dark:bg-slate-900/[0.2] p-6 hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {post.category}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-outfit, sans-serif)",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      lineHeight: 1.3,
                    }}
                    className="text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-900">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {post.readTime}
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer personalInfo={data.personalInfo} />
      <BackToTop />
    </>
  );
}
