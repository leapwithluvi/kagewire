import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import { Star, Play } from 'lucide-react';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { StackedDetailBanners } from '@/components/ads/StackedDetailBanners';
import { DetailPopupAd } from '@/components/ads/DetailPopupAd';
import { StickyFooterAd } from '@/components/ads/StickyFooterAd';
import { MediaItemListFilter } from '@/components/media/MediaItemListFilter';

interface DonghuaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function DonghuaDetailPage({ params }: DonghuaDetailPageProps) {
  const { slug } = await params;
  const donghua = await sankaApi.getDonghuaDetail(slug);

  if (!donghua) {
    notFound();
  }

  const episodes = donghua.episodes || [];
  const recommendations = donghua.recommendations || [];

  return (
    <>
      {/* Iklan Melayang Bawah — hanya di halaman detail */}
      <StickyFooterAd />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 0. Detail Entrance Pop-up Interstitial (4s countdown) */}
        <DetailPopupAd slug={`donghua-${slug}`} />

        {/* 1. Multi-Banner Stack (4 Baris Leaderboard 728x90px) */}
        <StackedDetailBanners className="mb-8" />

        {/* Top Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-14">
          {/* Left Column: Poster & Quick Action */}
          <div className="flex flex-col items-center md:items-start w-full">
            <div className="relative aspect-[3/4] w-56 sm:w-64 md:w-full rounded-md overflow-hidden bg-surface-card border border-border-subtle shadow-cinematic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={donghua.poster}
                alt={donghua.title}
                className="w-full h-full object-cover"
              />
              {donghua.rating && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-surface-main/90 text-amber text-xs font-bold border border-border-subtle num-tabular">
                  <Star className="w-3 h-3 fill-amber text-amber" />
                  {donghua.rating}
                </div>
              )}
            </div>

            {episodes.length > 0 && (
              <Link
                href={`/donghua/watch/${episodes[0].slug}`}
                className="mt-4 w-56 sm:w-64 md:w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-amber to-amber-hover text-background text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber/25"
              >
                <Play className="w-4 h-4 fill-background" />
                <span>Mulai Nonton Episode 1</span>
              </Link>
            )}
          </div>

          {/* Right Column: Title, Metadata, Genres, Synopsis */}
          <div className="md:col-span-2 lg:col-span-3 space-y-4">
            <div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-surface-secondary text-content-secondary border border-border-subtle">
                Donghua (Chinese Animation)
              </span>
              <h1 className="font-editorial text-2xl sm:text-4xl font-normal text-content-primary mt-2 leading-tight">
                {donghua.title}
              </h1>
            </div>

            {/* Info metadata badges if present */}
            {donghua.info && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-content-secondary">
                {Object.entries(donghua.info).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded border border-border-subtle"
                  >
                    <span className="text-content-muted capitalize">{key}:</span>
                    <span className="font-semibold text-content-primary">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Genre Badges */}
            {donghua.genres && donghua.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {donghua.genres.map((g, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-secondary text-content-secondary border border-border-subtle"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div className="space-y-1.5 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                Sinopsis
              </h3>
              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed whitespace-pre-line max-w-3xl">
                {donghua.synopsis || 'Belum ada sinopsis untuk serial ini.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Mid-Content Leaderboard Ad */}
        <AdBanner slotId="donghua-mid-strip" className="my-10" />

        {/* Episode List Section with Search & Batch Filter */}
        <section className="mb-14">
          <MediaItemListFilter
            items={episodes.map((ep, idx) => ({
              id: ep.slug || String(idx),
              title: ep.title,
              href: `/donghua/watch/${ep.slug}`,
              subtitle: ep.date,
              type: 'episode' as const,
            }))}
            type="episode"
            title="Daftar Episode"
            initialSort="desc"
            batchSize={50}
          />
        </section>

        {/* 4. Bottom Leaderboard Ad */}
        <AdBanner slotId="detail-bottom-banner" className="my-10" />

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-4 border-b border-border-subtle pb-3">
              <h2 className="font-editorial text-xl font-normal text-content-primary">
                Rekomendasi Donghua Lainnya
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendations.slice(0, 5).map((rec) => (
                <MediaCard
                  key={rec.slug}
                  id={rec.slug}
                  title={rec.title}
                  poster={rec.poster}
                  type="donghua"
                  href={`/donghua/${rec.slug}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
