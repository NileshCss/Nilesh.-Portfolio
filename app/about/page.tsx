import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { AboutSection } from "@/features/about/AboutSection";
import { ValuePropSection } from "@/features/about/ValuePropSection";
import { getPortfolioData } from "@/lib/supabase/portfolio";

export default async function AboutPage() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <AboutSection personalInfo={data.personalInfo} />
        <ValuePropSection />
      </main>
      <Footer personalInfo={data.personalInfo} />
      <BackToTop />
    </>
  );
}
