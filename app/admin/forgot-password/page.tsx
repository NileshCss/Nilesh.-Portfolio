"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, AlertCircle, Lock } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes("placeholder")) {
      setError("Supabase credentials are not configured on Vercel. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your project environment variables.");
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    
    // In Next.js, reset password will redirect user to /admin/reset-password
    const redirectUrl = `${window.location.origin}/admin/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: redirectUrl }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess("Check your email for the password reset link.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#06070a] font-sans relative overflow-hidden">
      {/* Floating Back to Home button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Home
      </Link>

      {/* Background radial gradient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/[0.04] dark:bg-blue-500/[0.02] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/[0.03] rounded-full blur-[100px]" />
        {/* Modern grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.25] dark:opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-[420px] z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Card */}
        <div 
          className="rounded-2xl border p-8 shadow-2xl backdrop-blur-xl transition-all duration-300"
          style={{
            background: "rgba(10, 11, 16, 0.65)",
            borderColor: "rgba(255, 255, 255, 0.06)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          }}
        >
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 
                  style={{ fontFamily: "var(--font-outfit, sans-serif)", fontWeight: 800 }}
                  className="text-lg text-white/90"
                >
                  Email Sent
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {success}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {/* Logo & Title */}
              <div className="text-center mb-2">
                {/* squircle logo mark */}
                <div
                  className="inline-flex items-center justify-center relative mb-4 transition-transform duration-300 hover:scale-105"
                  style={{
                    width: 44,
                    height: 44,
                    background: "#0F172A",
                    borderRadius: "22%",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 0 30px rgba(59, 130, 246, 0.25)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Arial, sans-serif",
                      fontWeight: 900,
                      fontSize: 22,
                      color: "#FFFFFF",
                      letterSpacing: "-1.5px",
                    }}
                  >
                    N
                  </span>
                  <span
                    className="absolute"
                    style={{
                      width: 8,
                      height: 8,
                      background: "#3B82F6",
                      borderRadius: "50%",
                      bottom: -1,
                      right: -1,
                    }}
                  />
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-outfit, sans-serif)",
                    fontWeight: 900,
                    fontSize: "1.5rem",
                    letterSpacing: "-0.03em",
                  }}
                  className="text-white"
                >
                  Reset Password
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                  Request a secure password reset link for your account.
                </p>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label 
                  style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                  className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nilesh.dev"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "rgba(255, 255, 255, 0.9)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
                    e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Error State */}
              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 animate-in fade-in duration-200">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer"
                style={{
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 99, 235, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.2)";
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <Mail size={14} className="ml-1" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Security Badge Footer */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
          <Lock size={12} className="text-slate-600" />
          <span>Protected Admin Area</span>
        </div>
      </div>
    </div>
  );
}
