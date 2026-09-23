import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import { Star, Play, Film, Calendar, Clock, Tv } from 'lucide-react';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { StackedDetailBanners } from '@/components/ads/StackedDetailBanners';
import { DetailPopupAd } from '@/components/ads/DetailPopupAd';
import { StickyFooterAd } from '@/components/ads/StickyFooterAd';
import { MediaItemListFilter } from '@/components/media/MediaItemListFilter';

interface AnimeDetailPageProps {
  params: Promise<{
    source: string;
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { source, slug } = await params;
  const anime = await sankaApi.getAnimeDetail(source, slug);

  if (!anime) {
    notFound();
  }

  let synopsisText = '';
  if (typeof anime.synopsis === 'string') {
    synopsisText = anime.synopsis;
  } else if (anime.synopsis && Array.isArray(anime.synopsis.paragraphs)) {
    synopsisText = anime.synopsis.paragraphs.join('\n\n');
  }

  const episodeList = anime.episodeList || [];
  const recommendedList = anime.recommendedAnimeList || [];

  return (
    <>
      {/* Iklan Melayang Bawah — hanya di halaman detail */}
      <StickyFooterAd />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 0. Detail Entrance Pop-up Interstitial (4s countdown) */}
        <DetailPopupAd slug={`anime-${slug}`} />

        {/* 1. Multi-Banner Stack (4 Baris Leaderboard 728x90px) */}
        <StackedDetailBanners className="mb-8" />

        {/* Top Media Details Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-14">
          {/* Left Column: Poster & Quick Action */}
          <div className="flex flex-col items-center md:items-start w-full">
            <div className="relative aspect-[3/4] w-56 sm:w-64 md:w-full rounded-md overflow-hidden bg-surface-card border border-border-subtle shadow-cinematic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
              {anime.score && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-surface-main/90 text-amber text-xs font-bold border border-border-subtle num-tabular">
                  <Star className="w-3 h-3 fill-amber text-amber" />
                  {anime.score}
                </div>
              )}
            </div>

            {episodeList.length > 0 && (
              <Link
                href={`/watch/${source}/${episodeList[0].episodeId || episodeList[0].href?.split('/').pop()}`}
                className="mt-4 w-56 sm:w-64 md:w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-amber to-amber-hover text-background text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber/25"
              >
                <Play className="w-4 h-4 fill-background" />
                <span>Mulai Nonton Episode 1</span>
              </Link>
            )}
          </div>

        {/* Right Column: Title, Metadata, Synopsis */}
        <div className="md:col-span-2 lg:col-span-3 space-y-4">
          <div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-surface-secondary text-amber border border-border-subtle">
              Serial Anime Sub Indo
            </span>
            <h1 className="font-editorial text-2xl sm:text-4xl font-normal text-content-primary mt-2 leading-tight">
              {anime.title}
            </h1>
            {anime.japanese && (
              <p className="text-xs text-content-muted mt-1 font-sans">
                {anime.japanese}
              </p>
            )}
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-content-secondary">
            {anime.type && (
              <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded border border-border-subtle">
                <Tv className="w-3 h-3 text-amber" />
                <span>{anime.type}</span>
              </div>
            )}
            {anime.status && (
              <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded border border-border-subtle">
                <Film className="w-3 h-3 text-amber" />
                <span>{anime.status}</span>
              </div>
            )}
            {anime.episodes && (
              <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded border border-border-subtle num-tabular">
                <Clock className="w-3 h-3 text-amber" />
                <span>{anime.episodes} Episode</span>
              </div>
            )}
            {anime.aired && (
              <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded border border-border-subtle">
                <Calendar className="w-3 h-3 text-amber" />
                <span>{anime.aired}</span>
              </div>
            )}
          </div>

          {/* Genre Tags */}
          {anime.genreList && anime.genreList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {anime.genreList.map((g, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-secondary text-content-secondary border border-border-subtle"
                >
                  {g.title || g.name}
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
              {synopsisText || 'Belum ada sinopsis untuk judul ini.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Mid-Content Multi-Strip Ad */}
      <AdBanner slotId="anime-mid-strip" className="my-10" />

      {/* Episode List Section with Search & Batch Filter */}
      <section className="mb-14">
        <MediaItemListFilter
          items={episodeList.map((ep, idx) => {
            const epId = ep.episodeId || ep.href?.split('/').filter(Boolean).pop() || String(idx + 1);
            return {
              id: `${epId}-${idx}`,
              title: String(ep.title),
              href: `/watch/${source}/${epId}`,
              subtitle: ep.date,
              type: 'episode' as const,
            };
          })}
          type="episode"
          title="Daftar Episode"
          initialSort="desc"
          batchSize={50}
        />
      </section>

      {/* 4. Bottom Leaderboard Ad */}
      <AdBanner slotId="detail-bottom-banner" className="my-10" />

      {/* Recommendations */}
      {recommendedList.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-4 border-b border-border-subtle pb-3">
            <h2 className="font-editorial text-xl font-normal text-content-primary">
              Rekomendasi Serupa
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedList.slice(0, 5).map((rec) => (
              <MediaCard
                key={rec.animeId}
                id={rec.animeId}
                title={rec.title}
                poster={rec.poster}
                type="anime"
                href={`/anime/${source}/${rec.animeId}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}

