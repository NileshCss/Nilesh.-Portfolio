import { HeroSection } from "@/features/hero/HeroSection";
import { ValuePropSection } from "@/features/about/ValuePropSection";
import { AboutSection } from "@/features/about/AboutSection";
import { ExperienceSection } from "@/features/experience/ExperienceSection";
import { ProjectsSection } from "@/features/projects/ProjectsSection";
import { SkillsSection } from "@/features/skills/SkillsSection";
import { AchievementsSection } from "@/features/achievements/AchievementsSection";
import { CTABanner } from "@/features/cta/CTABanner";
import { ContactSection } from "@/features/contact/ContactSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { getPortfolioData } from "@/lib/supabase/portfolio";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection personalInfo={data.personalInfo} />
        <ValuePropSection />
        <ProjectsSection projects={data.projects} />
        <SkillsSection skills={data.skills} />
        <AboutSection personalInfo={data.personalInfo} />
        <ExperienceSection experiences={data.experiences} />
        <AchievementsSection achievements={data.achievements} />
        <CTABanner />
        <ContactSection personalInfo={data.personalInfo} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
