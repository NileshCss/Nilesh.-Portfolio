"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="bg-white px-6 pb-20">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, type: "tween" }}
          className="bg-slate-50 border border-slate-200 rounded-2xl px-[52px] py-12 flex flex-wrap items-center justify-between gap-7"
        >
          {/* Left */}
          <div>
            <h2
              className="font-black text-slate-900 leading-[1.2] mb-2"
              style={{
                fontSize: "clamp(1.375rem, 2.5vw, 1.875rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Let&apos;s Build Something Meaningful Together
            </h2>
            <p className="text-[0.9375rem] text-slate-500 max-w-[400px]">
              Have a project in mind or want to discuss an opportunity? I&apos;d love to hear from you.
            </p>
          </div>

          {/* Right — action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-[18px] py-2.5 bg-blue-600 text-white text-[0.9375rem] font-semibold rounded-lg hover:bg-blue-500 hover:-translate-y-px hover:shadow-md transition-all duration-[220ms]"
            >
              <Calendar size={15} />
              Schedule Meeting
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-[18px] py-2.5 bg-white text-slate-900 text-[0.9375rem] font-semibold rounded-lg border border-[#CBD5E1] hover:border-blue-600 hover:text-blue-600 transition-all duration-[220ms]"
            >
              Contact Me
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
