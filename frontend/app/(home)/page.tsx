import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreakingNewsTicker } from "@/components/layout/BreakingNewsTicker";
import { HeroSection } from "./_components/HeroSection";
import { NewsGrid } from "./_components/NewsGrid";
import { Sidebar } from "./_components/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas-background font-sans text-charcoal-ink selection:bg-brand-primary/20">
      <Header />
      <BreakingNewsTicker />

      {/* Kontainer Utama */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <HeroSection />

        <div className="flex flex-col gap-10 lg:flex-row">
          <NewsGrid />
          <Sidebar />
        </div>
      </div>

      <Footer />
    </div>
  );
}
