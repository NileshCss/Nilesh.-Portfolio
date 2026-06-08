import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { getPortfolioData } from "@/lib/supabase/portfolio";
import { Download, FileText, ExternalLink, Calendar } from "lucide-react";

export default async function ResumePage() {
  const data = await getPortfolioData();
  const resumeUrl = data.personalInfo?.resumeUrl;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-6 max-w-[1000px] mx-auto font-sans text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/15 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Curriculum Vitae
            </span>
            <h1
              style={{
                fontFamily: "var(--font-outfit, sans-serif)",
                fontWeight: 900,
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                letterSpacing: "-0.04em",
              }}
              className="text-slate-900 dark:text-white"
            >
              Resume & Credentials
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Download or preview my latest professional qualifications.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              >
                <Download size={15} /> Download PDF
              </a>
            )}
          </div>
        </div>

        {/* Layout: Info Card + Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Left: Summary */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/[0.3] dark:bg-slate-900/[0.2]">
              <h3 className="font-bold text-sm uppercase text-slate-400 mb-4 tracking-wider">File Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-500 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Format</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">PDF Document</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-500 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Last Updated</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">June 2026</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/[0.3] dark:bg-slate-900/[0.2] space-y-4">
              <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider">Quick Note</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If the document does not render correctly, please click the "Download PDF" or "Open in New Tab" buttons to access the file directly.
              </p>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Open in New Tab <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Right: Embed Frame */}
          <div className="h-[700px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 relative">
            {resumeUrl ? (
              <iframe
                src={`${resumeUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none"
                title="Resume Preview"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <FileText size={48} className="text-slate-400 animate-pulse" />
                <p className="font-bold text-slate-600 dark:text-slate-400">No Resume Uploaded</p>
                <p className="text-xs text-slate-400 max-w-[240px]">
                  Upload a resume via the Admin Dashboard under Content &gt; Resume to view and download it.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer personalInfo={data.personalInfo} />
      <BackToTop />
    </>
  );
}
