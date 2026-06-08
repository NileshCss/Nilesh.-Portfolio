import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ContactSection } from "@/features/contact/ContactSection";
import { getPortfolioData } from "@/lib/supabase/portfolio";

export default async function ContactPage() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <ContactSection personalInfo={data.personalInfo} />
      </main>
      <Footer personalInfo={data.personalInfo} />
      <BackToTop />
    </>
  );
}
