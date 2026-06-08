import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ProjectsSection } from "@/features/projects/ProjectsSection";
import { getPortfolioData } from "@/lib/supabase/portfolio";

export default async function ProjectsPage() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <ProjectsSection projects={data.projects} />
      </main>
      <Footer personalInfo={data.personalInfo} />
      <BackToTop />
    </>
  );
}
