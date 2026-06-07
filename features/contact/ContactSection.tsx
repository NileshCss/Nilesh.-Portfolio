"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { personal } from "@/data/personal";
import type { PersonalInfo } from "@/types";
import { cn } from "@/lib/utils";

// Social icons
function GitHubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  );
}

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, type: "tween" },
  },
};

export function ContactSection({ personalInfo = personal }: { personalInfo?: PersonalInfo }) {
  const socials = [
    ...(personalInfo.github ? [{ icon: GitHubIcon, label: "GitHub", href: personalInfo.github, handle: personalInfo.github.split("/").pop() || "GitHub" }] : []),
    ...(personalInfo.linkedin ? [{ icon: LinkedInIcon, label: "LinkedIn", href: personalInfo.linkedin, handle: personalInfo.linkedin.split("/").pop() || "LinkedIn" }] : []),
    ...(personalInfo.twitter ? [{ icon: XIcon, label: "X / Twitter", href: personalInfo.twitter, handle: personalInfo.twitter.split("/").pop() || "X" }] : []),
    { icon: Mail, label: "Email", href: `mailto:${personalInfo.email}`, handle: personalInfo.email },
  ];

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-[72px] bg-white border-t border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div variants={item}>
            <SectionHeader
              eyebrow="Contact"
              title="Let's talk."
              description="Open to full-time roles, interesting projects, and meaningful conversations about software and product."
              accentUnderline
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mt-4">
            {/* Left — Social links + availability */}
            <motion.div variants={item} className="space-y-8">
              {/* Open to Work */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">Open to Work</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Actively looking for Full Stack Java Developer, Software Engineer, and Product Engineering roles at product-based companies.
                </p>
              </div>

              {/* Social links */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Find me on
                </p>
                <div className="space-y-3">
                  {socials.map(({ icon: Icon, label, href, handle }) => (
                    <Link
                      key={label}
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-600 hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)] transition-all duration-200"
                    >
                      <span className="p-2 rounded-lg bg-slate-50 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                        <span className="text-slate-500 group-hover:text-blue-600 transition-colors flex">
                          <Icon size={15} />
                        </span>
                      </span>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                        <p className="text-sm text-slate-700 font-medium">{handle}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resume download */}
              {personalInfo.resumeUrl && (
                <Link
                  href={personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600 text-sm font-semibold transition-all duration-200"
                >
                  <Download size={15} className="group-hover:text-blue-600 transition-colors" />
                  Download Resume
                </Link>
              )}
            </motion.div>

            {/* Right — Contact form */}
            <motion.div variants={item}>
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-8 rounded-2xl border border-emerald-200 bg-emerald-50">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">Message sent!</h3>
                    <p className="text-sm text-slate-500">
                      Thanks for reaching out. I&apos;ll get back to you soon.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      {...register("name")}
                      placeholder="Your name"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                        errors.name ? "border-red-400" : "border-slate-200"
                      )}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      {...register("email")}
                      placeholder="your@email.com"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                        errors.email ? "border-red-400" : "border-slate-200"
                      )}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      {...register("message")}
                      placeholder="Tell me about the role, project, or just say hello..."
                      rows={5}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none",
                        errors.message ? "border-red-400" : "border-slate-200"
                      )}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>
                    )}
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      <AlertCircle size={15} />
                      Something went wrong. Please email me directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                  >
                    <Send size={15} />
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
