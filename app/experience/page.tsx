import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ExperienceSection } from "@/features/experience/ExperienceSection";
import { getPortfolioData } from "@/lib/supabase/portfolio";

export default async function ExperiencePage() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <ExperienceSection experiences={data.experiences} />
      </main>
      <Footer personalInfo={data.personalInfo} />
      <BackToTop />
    </>
  );
}
