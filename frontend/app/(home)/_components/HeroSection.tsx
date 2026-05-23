"use client";

import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { useFeaturedAnime } from "@/hooks/useFeaturedAnime";
import { NewsArticleCard } from "./NewsArticleCard";

export function HeroSection() {
  const { data: liveAnime, loading, error } = useFeaturedAnime();

  // If loading, render high-craft Ghibli watercolor skeleton loaders
  if (loading) {
    return (
      <section className="mb-12 grid gap-5 sm:gap-6 lg:grid-cols-12 lg:grid-rows-2 lg:h-[550px] relative animate-pulse">
        {/* Left Main Card Skeleton */}
        <div className="rounded-[32px] border border-brand-primary-border/40 bg-surface-slate/40 p-6 lg:col-span-8 lg:row-span-2 lg:h-full flex flex-col justify-between">
          <div className="grid gap-6 lg:grid-cols-12 h-full">
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-24 bg-brand-primary/10 rounded-full"></div>
                  <div className="h-6 w-16 bg-brand-primary/5 rounded-full"></div>
                </div>
                <div className="h-8 w-[90%] bg-charcoal-ink/10 rounded-lg mb-3"></div>
                <div className="h-8 w-[60%] bg-charcoal-ink/10 rounded-lg mb-6"></div>
                <div className="h-4 w-full bg-charcoal-ink/5 rounded-md mb-2"></div>
                <div className="h-4 w-[95%] bg-charcoal-ink/5 rounded-md mb-2"></div>
                <div className="h-4 w-[80%] bg-charcoal-ink/5 rounded-md"></div>
              </div>
              <div className="h-10 w-full bg-charcoal-ink/5 rounded-lg mt-6"></div>
            </div>
            <div className="lg:col-span-5 rounded-[24px] bg-canvas-background/30 border border-brand-primary-border/20 flex items-center justify-center min-h-[220px]">
              <div className="h-28 w-28 rounded-full bg-brand-primary-border/10"></div>
            </div>
          </div>
        </div>

        {/* Upper Right Card Skeleton */}
        <div className="rounded-[28px] border border-brand-primary-border/40 bg-surface-slate/40 p-5 lg:col-span-4 lg:row-span-1 lg:h-full flex flex-col justify-between">
          <div className="flex gap-4 items-start">
            <div className="h-20 w-20 rounded-2xl bg-canvas-background/30 shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 w-12 bg-brand-primary/10 rounded-full mb-2"></div>
              <div className="h-5 w-full bg-charcoal-ink/10 rounded-md mb-2"></div>
              <div className="h-5 w-[70%] bg-charcoal-ink/10 rounded-md"></div>
            </div>
          </div>
          <div className="h-4 w-full bg-charcoal-ink/5 rounded-md mt-4"></div>
        </div>

        {/* Lower Right Card Skeleton */}
        <div className="rounded-[28px] border border-brand-primary-border/40 bg-surface-slate/40 p-5 lg:col-span-4 lg:row-span-1 lg:h-full flex flex-col justify-between">
          <div className="flex gap-4 items-start">
            <div className="h-20 w-20 rounded-2xl bg-canvas-background/30 shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 w-12 bg-brand-primary/10 rounded-full mb-2"></div>
              <div className="h-5 w-full bg-charcoal-ink/10 rounded-md mb-2"></div>
              <div className="h-5 w-[70%] bg-charcoal-ink/10 rounded-md"></div>
            </div>
          </div>
          <div className="h-4 w-full bg-charcoal-ink/5 rounded-md mt-4"></div>
        </div>
      </section>
    );
  }

  // Use live data when available. If ANN doesn't provide at least 3 items, render nothing.
  const items = !error && liveAnime && liveAnime.length >= 3 ? liveAnime : [];

  if (items.length < 3) return null;

  return (
    <section className="mb-12 grid gap-5 sm:gap-6 lg:grid-cols-12 lg:grid-rows-2 lg:h-[550px] relative">
      {/* Self-contained custom Ghibli watercolor animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ghibliFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2.5deg); }
        }
        @keyframes ghibliMorph {
          0%, 100% { border-radius: 48% 52% 47% 53% / 50% 48% 52% 50%; }
          50% { border-radius: 53% 47% 55% 45% / 45% 55% 48% 52%; }
        }
        @keyframes ghibliWind {
          0% { stroke-dashoffset: 120; opacity: 0.15; }
          50% { opacity: 0.45; }
          100% { stroke-dashoffset: 0; opacity: 0.15; }
        }
        .ghibli-float { animation: ghibliFloat 6s ease-in-out infinite; }
        .ghibli-morph { animation: ghibliMorph 8s ease-in-out infinite; }
        .ghibli-wind-path {
          stroke-dasharray: 120;
          animation: ghibliWind 15s linear infinite;
        }
      `}} />

      {/* --- FEATURED JOURNAL CARD (LEFT 8 COLUMNS) --- */}
      <div className="group relative overflow-hidden rounded-[32px] border border-brand-primary-border bg-surface-slate p-6 shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(207,163,117,0.12)] hover:-translate-y-1 lg:col-span-8 lg:row-span-2 lg:h-full flex flex-col justify-between cursor-pointer">
        {/* Sketching grid layout helper lines */}
        <div className="absolute inset-2 border border-dashed border-brand-primary-border/25 rounded-[26px] pointer-events-none" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:h-full items-stretch">
          {/* Left Panel: High-Craft Editorial content */}
          <div className="lg:col-span-7 flex flex-col justify-between py-2 lg:pr-4">
            <div>
              {/* Hand-inked stamp badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 font-mono text-[9px] font-bold uppercase tracking-[1.5px] text-brand-primary shadow-xs">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${!error && liveAnime && liveAnime.length >= 3 ? "bg-[#4a9c68]" : "bg-amber-500"} animate-pulse`} />
                  {!error && liveAnime && liveAnime.length >= 3 ? "Live Journal" : "Curated Archive"}
                </span>
                <CategoryBadge category={items[0].category} />
              </div>

              {/* Massive Serif Title */}
              <h1 className="font-serif text-3xl font-bold leading-[1.1] text-charcoal-ink transition-colors group-hover:text-brand-primary sm:text-4xl lg:text-[32px] xl:text-[36px]">
                {items[0].title}
              </h1>

              {/* Relaxed spacing excerpt */}
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-text font-serif max-w-lg">
                {items[0].excerpt}
              </p>
            </div>

            {/* Premium Editorial Byline */}
            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-dashed border-brand-primary-border/20 font-mono text-xs text-muted-gray">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-primary/15 border border-brand-primary-border/30 flex items-center justify-center font-bold text-brand-primary text-[10px]">
                  AN
                </div>
                <span className="font-bold text-charcoal-ink">{items[0].author}</span>
              </div>
              <span className="text-brand-primary-border/40">|</span>
              <span>{items[0].date}</span>
              <span className="text-brand-primary-border/40">|</span>
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {items[0].readingTime} min read
              </span>
            </div>
          </div>

          {/* Right Panel: Hand-Drawn Watercolor Showcase Window */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[220px] lg:min-h-full rounded-[24px] border border-brand-primary-border/35 bg-canvas-background overflow-hidden shadow-inner group-hover:scale-[1.01] transition-transform duration-500">
            {/* Dashed frame layout border */}
            <div className="absolute inset-1.5 border border-dashed border-brand-primary-border/20 rounded-[inherit] pointer-events-none" />

            {/* Watercolor Wash Backing */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#fdfbf7] via-[#ebf7f0] to-[#e1f3fc] opacity-80" />

            {/* Ghibli-esque Soft Clouds */}
            <div className="absolute top-[18%] left-[12%] w-14 h-7 bg-white/70 rounded-full blur-[3px] select-none pointer-events-none" />
            <div className="absolute top-[28%] right-[16%] w-20 h-9 bg-white/80 rounded-full blur-[4px] select-none pointer-events-none" />

            {/* CSS Landscape Rolling Hills */}
            <div className="absolute bottom-0 left-0 right-0 w-full h-[50%] z-0 select-none pointer-events-none opacity-60">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                {/* Back Hill */}
                <path d="M0,100 C30,75 70,85 100,100 Z" fill="var(--timeline-rule)" opacity="0.4" />
                {/* Middle Hill */}
                <path d="M0,100 C20,90 50,70 100,100 Z" fill="var(--brand-primary)" opacity="0.25" />
                {/* Front Hill */}
                <path d="M0,100 C40,92 80,78 100,100 Z" fill="var(--brand-primary)" opacity="0.4" />
              </svg>
            </div>

            {/* Wind Swirl Trails */}
            <div className="absolute inset-0 z-10 select-none pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full text-brand-primary/20" fill="none" stroke="currentColor" strokeWidth="0.75">
                <path d="M -10,32 C 30,22 40,52 60,42 C 70,37 75,27 90,32 C 100,34 110,42 120,40" className="ghibli-wind-path" />
                <path d="M -20,62 C 20,42 30,72 50,62 C 65,52 70,42 85,52 C 95,57 105,72 115,67" className="ghibli-wind-path" style={{ animationDelay: '-5s' }} />
              </svg>
            </div>

            {/* Morphing Floating Icon Blob or Cover Poster */}
            <div className="ghibli-float relative z-10">
              <div className="ghibli-morph flex h-32 w-28 items-center justify-center border border-brand-primary-border/30 bg-white/45 dark:bg-black/15 backdrop-blur-xs shadow-md shadow-amber-900/[0.04] transition-all duration-500 hover:scale-105 overflow-hidden"
                style={{
                  boxShadow: "inset 0 4px 12px rgba(255,255,255,0.45), 0 8px 24px rgba(207,163,117,0.15)"
                }}
              >
                {items[0].image ? (
                  <img
                    src={items[0].image}
                    alt={items[0].title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-6.5xl select-none filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)]">
                    {items[0].icon}
                  </span>
                )}
              </div>
            </div>

            {/* Handwritten Artist Caption */}
            <div className="absolute bottom-2 left-3 z-20 font-mono text-[8px] tracking-wider text-muted-gray uppercase select-none opacity-60">
              Illustration No. 01 — Studio Hills
            </div>

            {/* Little ivy elements in the corner */}
            <div className="absolute top-2.5 right-2.5 opacity-35 text-brand-primary">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17,8C8,8,4,16,4,16s8-1,11-5s2-7,2-7S17,6,17,8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECONDARY NEWS CARD 1 (RIGHT UPPER COLUMN) --- */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-brand-primary-border bg-surface-slate p-5 shadow-sm transition-all duration-500 hover:shadow-[0_15px_35px_rgba(207,163,117,0.1)] hover:-translate-y-0.5 lg:col-span-4 lg:row-span-1 lg:h-full cursor-pointer">
        <div className="absolute inset-1.5 border border-dashed border-brand-primary-border/20 rounded-[22px] pointer-events-none" />
        <div className="relative z-10 w-full">
          <NewsArticleCard article={items[1]} variant="horizontal" />
        </div>
      </div>

      {/* --- SECONDARY NEWS CARD 2 (RIGHT LOWER COLUMN) --- */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-brand-primary-border bg-surface-slate p-5 shadow-sm transition-all duration-500 hover:shadow-[0_15px_35px_rgba(207,163,117,0.1)] hover:-translate-y-0.5 lg:col-span-4 lg:row-span-1 lg:h-full cursor-pointer">
        <div className="absolute inset-1.5 border border-dashed border-brand-primary-border/20 rounded-[22px] pointer-events-none" />
        <div className="relative z-10 w-full">
          <NewsArticleCard article={items[2]} variant="horizontal" />
        </div>
      </div>
    </section>
  );
}
