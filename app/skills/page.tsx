import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { SkillsSection } from "@/features/skills/SkillsSection";
import { getPortfolioData } from "@/lib/supabase/portfolio";

export default async function SkillsPage() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <SkillsSection skills={data.skills} />
      </main>
      <Footer personalInfo={data.personalInfo} />
      <BackToTop />
    </>
  );
}
