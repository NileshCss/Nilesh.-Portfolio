import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { getPortfolioData } from "@/lib/supabase/portfolio";
import { Code2, Server, Database, Cloud, Brain, ShieldAlert } from "lucide-react";

const services = [
  {
    icon: Server,
    title: "Backend Development",
    desc: "Building production-grade REST & GraphQL APIs using Java, Spring Boot, and Microservices architecture. Focus on performance, scalability, and clean code principles.",
  },
  {
    icon: Code2,
    title: "Frontend Engineering",
    desc: "Designing fast, responsive, and SEO-optimized user interfaces using React, Next.js, and Tailwind CSS. Implementing modern state management and glassmorphic micro-animations.",
  },
  {
    icon: Database,
    title: "Database Architecture",
    desc: "Configuring relational and non-relational database schemas using PostgreSQL, MySQL, and MongoDB. Writing optimized queries, setting up Supabase, RLS policies, and indexes.",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps Solutions",
    desc: "Deploying applications to cloud platforms (AWS, Vercel, Heroku) with robust CI/CD pipelines. Configuring Docker containerization and server management.",
  },
  {
    icon: Brain,
    title: "AI & SaaS Integrations",
    desc: "Integrating Large Language Models (LLMs), LangChain, and vector databases for building intelligent applications. Crafting modern SaaS solutions with subscription models.",
  },
  {
    icon: ShieldAlert,
    title: "Security & Optimization",
    desc: "Implementing secure authentication systems with JWT, OAuth2, and Supabase Auth. Enhancing web performance to hit 95+ Lighthouse scores.",
  },
];

export default async function ServicesPage() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6 max-w-[1200px] mx-auto font-sans text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="relative mb-16 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/[0.04] rounded-full blur-[100px] pointer-events-none" />
          
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/15 px-3.5 py-1.5 rounded-full inline-block mb-4">
            My Services
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
            What I Can Do For You
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-[600px] mx-auto leading-relaxed">
            I offer a wide range of services to bring your ideas to life. From backend design to pixel-perfect frontends.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="group rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/[0.3] dark:bg-slate-900/[0.2] p-6 hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon box */}
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-outfit, sans-serif)",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                  }}
                  className="text-slate-900 dark:text-white mb-2"
                >
                  {svc.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {svc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </main>
      <Footer personalInfo={data.personalInfo} />
      <BackToTop />
    </>
  );
}
