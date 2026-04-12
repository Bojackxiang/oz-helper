import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { CategoriesSection } from "@/components/marketing/categories-section";
import { SafetySection } from "@/components/marketing/safety-section";
import { CTASection } from "@/components/marketing/cta-section";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <CategoriesSection />
        <SafetySection />
        <CTASection />
      </main>
      <MarketingFooter />
    </div>
  );
}
