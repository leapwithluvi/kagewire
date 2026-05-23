"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLatestNews } from "@/hooks/useLatestNews";
import { NewsArticleCard } from "./NewsArticleCard";

export function NewsGrid() {
  const { data: liveNews, loading, error } = useLatestNews(155, 24);

  // While loading, show skeletons. Do not show dummy content.
  if (loading) {
    return (
      <main className="flex-1 min-w-0">
        <SectionHeader title="Latest News" actionText="View All" actionHref="#" />
        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          <div className="h-48 rounded-2xl bg-surface-slate/40 animate-pulse" />
          <div className="h-48 rounded-2xl bg-surface-slate/40 animate-pulse" />
        </div>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="h-16 rounded-lg bg-surface-slate/30 animate-pulse" />
          <div className="h-16 rounded-lg bg-surface-slate/30 animate-pulse" />
          <div className="h-16 rounded-lg bg-surface-slate/30 animate-pulse" />
          <div className="h-16 rounded-lg bg-surface-slate/30 animate-pulse" />
        </div>
      </main>
    );
  }

  if (error || !liveNews || liveNews.length === 0) {
    // Don't render placeholder or mock data if there's no live news.
    return null;
  }

  const sourceNews = liveNews;
  const largeNews = sourceNews.slice(0, 2);
  const smallNews = sourceNews.slice(2);

  return (
    <main className="flex-1 min-w-0">
      <SectionHeader title="Latest News" actionText="View All" actionHref="#" />

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        {largeNews.map((article) => (
          <NewsArticleCard key={article.id} article={article} variant="large" />
        ))}
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[2px] text-muted-gray">
          More Stories
        </span>
        <div className="flex-1 border-t border-dashed border-brand-primary-border/30" />
      </div>

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {smallNews.map((article) => (
          <NewsArticleCard key={article.id} article={article} variant="horizontal" />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-brand-primary-border/20 pt-6">
        <span className="font-mono text-[10px] text-muted-gray uppercase tracking-widest">
          Page 1 of 24
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, "...", 24].map((page, i) => (
            <button
              key={i}
              className={`h-8 w-8 rounded-full font-mono text-xs font-bold transition-all ${
                page === 1
                  ? "bg-brand-primary text-white"
                  : "text-muted-gray hover:bg-surface-slate hover:text-charcoal-ink"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="ml-1 flex h-8 items-center gap-1 rounded-full px-3 font-mono text-xs font-bold text-muted-gray transition-all hover:bg-surface-slate hover:text-charcoal-ink">
            Next
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
