"use client";

const BREAKING_NEWS = [
  "Studio Ghibli officially confirms production of new 2027 feature film helmed by Miyazaki's protégé",
  "Jujutsu Kaisen Season 3 finale breaks streaming records — 12M concurrent viewers worldwide",
  "Comic Frontier 22 di ICE BSD Tangerang Selatan, 16–17 Mei 2026 — Tiket soldout dalam 3 jam",
  "Oshi no Ko Season 2 resmi dikonfirmasi untuk rilis musim panas 2026",
  "Tensura: Tears of the Azure Sea meraih Rp 4,2 Miliar di box office Indonesia pekan pertama",
  "One Piece Chapter 1120: Gear 6 Luffy mengejutkan seluruh komunitas manga global",
];

export function BreakingNewsTicker() {
  const items = [...BREAKING_NEWS, ...BREAKING_NEWS];

  return (
    <div className="relative z-40 flex h-9 items-stretch overflow-hidden border-b border-brand-primary-border/20 bg-canvas-background">
      <div className="relative z-10 flex shrink-0 items-center gap-2 bg-brand-primary px-4 pr-5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <span className="font-mono text-[10px] font-black uppercase tracking-[2px] text-white">
          Breaking
        </span>
        <div
          className="absolute right-0 top-0 h-full w-4 translate-x-3.5"
          style={{
            background: "var(--brand-primary)",
            clipPath: "polygon(0 0, 60% 0, 100% 50%, 60% 100%, 0 100%)",
          }}
        />
      </div>

      <div className="relative flex flex-1 items-center overflow-hidden">
        <div className="pointer-events-none absolute left-0 z-10 h-full w-10 bg-linear-to-r from-canvas-background to-transparent" />
        <div className="pointer-events-none absolute right-0 z-10 h-full w-10 bg-linear-to-l from-canvas-background to-transparent" />

        {/* Scrolling content */}
        <div className="ticker-track flex animate-[ticker_40s_linear_infinite] items-center gap-0 whitespace-nowrap">
          {items.map((headline, i) => (
            <span key={i} className="flex items-center">
              <span className="cursor-pointer px-6 text-xs font-medium text-charcoal-ink transition-colors hover:text-brand-primary">
                {headline}
              </span>
              <span className="text-brand-primary-border/50 text-xs select-none">◆</span>
            </span>
          ))}
        </div>
      </div>

      <a
        href="#"
        className="hidden shrink-0 items-center gap-1.5 border-l border-brand-primary-border/20 px-4 text-[10px] font-bold uppercase tracking-widest text-brand-primary transition-colors hover:bg-brand-primary/5 sm:flex"
      >
        All News
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
