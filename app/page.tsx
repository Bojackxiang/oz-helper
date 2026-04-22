import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { CTASection } from "@/components/marketing/cta-section";
import { TaskDiscoveryHero } from "@/components/tasks/task-discovery-hero";
import { TaskFeed } from "@/components/tasks/task-feed";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080808]">
      <MarketingHeader />

      <main className="flex-1">
        <TaskDiscoveryHero />
        <TaskFeed />
        <CTASection />
      </main>

      <MarketingFooter />
    </div>
  );
}
