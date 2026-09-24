import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import { Star, Play, Film, Calendar, Clock, Tv, Sparkles } from 'lucide-react';
import MediaCard from '@/components/ui/MediaCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { AdBanner } from '@/components/ads/AdBanner';
import { StackedDetailBanners } from '@/components/ads/StackedDetailBanners';
import { DetailPopupAd } from '@/components/ads/DetailPopupAd';
import { StickyFooterAd } from '@/components/ads/StickyFooterAd';
import { MediaItemListFilter } from '@/components/media/MediaItemListFilter';
import { getResolvedSynopsis } from '@/lib/synopsis-helper';

import type { Metadata } from 'next';

interface AnimeDetailPageProps {
  params: Promise<{
    source: string;
    slug: string;
  }>;
}

export const revalidate = 300;

const ALLOWED_ANIME_SOURCES = ['otakudesu', 'samehadaku'];

export async function generateMetadata({ params }: AnimeDetailPageProps): Promise<Metadata> {
  const { source, slug } = await params;
  if (!ALLOWED_ANIME_SOURCES.includes(source) || !slug) {
    return { title: 'Anime Detail' };
  }

  const anime = await sankaApi.getAnimeDetail(source, slug);
  if (!anime) {
    return { title: 'Anime Tidak Ditemukan' };
  }

  const rawSynopsis = typeof anime.synopsis === 'string' ? anime.synopsis.replace(/<[^>]*>/g, '').trim() : '';
  const desc = rawSynopsis.slice(0, 160) || `Nonton streaming anime ${anime.title} subtitle Indonesia online gratis kualitas HD. Episode lengkap dan update terbaru di KageWire.`;

  return {
    title: `${anime.title} Sub Indo — Streaming & Episode Lengkap`,
    description: desc,
    keywords: [
      anime.title,
      `${anime.title} sub indo`,
      `nonton ${anime.title}`,
      `streaming ${anime.title}`,
      'anime sub indo',
      source,
    ],
    openGraph: {
      title: `${anime.title} Sub Indo | KageWire`,
      description: desc,
      images: anime.poster ? [{ url: anime.poster, alt: anime.title }] : [],
      type: 'video.tv_show',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${anime.title} Sub Indo | KageWire`,
      description: desc,
      images: anime.poster ? [anime.poster] : [],
    },
  };
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { source, slug } = await params;

  // Security: validate source allowlist and prevent path traversal
  if (
    !source ||
    !ALLOWED_ANIME_SOURCES.includes(source) ||
    !slug ||
    slug.length > 150 ||
    slug.includes('/') ||
    slug.includes('..')
  ) {
    notFound();
  }

  const anime = await sankaApi.getAnimeDetail(source, slug);

  if (!anime) {
    notFound();
  }

  // Extract raw synopsis from all known fields
  let rawSynopsis = '';
  if (typeof anime.synopsis === 'string' && anime.synopsis.trim()) {
    rawSynopsis = anime.synopsis.replace(/<[^>]*>/g, '').trim();
  } else if (Array.isArray(anime.synopsis)) {
    rawSynopsis = anime.synopsis.map((p) => (typeof p === 'string' ? p.replace(/<[^>]*>/g, '').trim() : String(p))).join('\n\n');
  } else if (anime.synopsis && Array.isArray((anime.synopsis as any).paragraphs)) {
    rawSynopsis = (anime.synopsis as any).paragraphs.map((p: any) => String(p).replace(/<[^>]*>/g, '').trim()).join('\n\n');
  } else if ((anime as any).sinopsis) {
    const s = (anime as any).sinopsis;
    rawSynopsis = typeof s === 'string' ? s.replace(/<[^>]*>/g, '').trim() : Array.isArray(s) ? s.join('\n\n') : '';
  } else if ((anime as any).description) {
    const d = (anime as any).description;
    rawSynopsis = typeof d === 'string' ? d.replace(/<[^>]*>/g, '').trim() : Array.isArray(d) ? d.join('\n\n') : '';
  }

  const genreNames = (anime.genreList || []).map((g: any) => g.title || g.name || '');
  const synopsisText = getResolvedSynopsis(
    anime.title,
    'anime',
    rawSynopsis,
    genreNames,
    String(anime.status || '')
  );

  const episodeList = anime.episodeList || [];
  const recommendedList = anime.recommendedAnimeList || [];

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kagewire.vercel.app';
  const pageUrl = `${siteUrl}/anime/${source}/${slug}`;

  return (
    <>
      {/* Schema.org Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'TVSeries',
                '@id': `${pageUrl}/#series`,
                name: anime.title,
                description: synopsisText,
                image: anime.poster,
                genre: genreNames,
                inLanguage: 'ja',
                subtitleLanguage: 'id',
                numberOfEpisodes: episodeList.length || undefined,
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Beranda',
                    item: siteUrl,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Anime',
                    item: `${siteUrl}/anime`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: anime.title,
                    item: pageUrl,
                  },
                ],
              },
            ],
          }),
        }}
      />

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
                src={anime.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'}
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
                href={episodeList[0].href || `/watch/${source}/${episodeList[0].episodeId || episodeList[0].href?.split('/').pop()}`}
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
              {synopsisText}
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
            // Extract episode number from eps field or title
            const titleStr = String(ep.title ?? '');
            const epNum = ep.eps ?? (titleStr.match(/(?:episode\s*|ep\s*)(\d+)/i)?.[1] ? Number(titleStr.match(/(?:episode\s*|ep\s*)(\d+)/i)![1]) : idx + 1);
            return {
              id: `${epId}-${idx}`,
              title: `Episode ${epNum}`,
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
          <SectionHeader
            title="Rekomendasi Serupa"
            badge={`${recommendedList.length} Judul`}
            subtitle="Anime pilihan serupa dengan cerita dan genre yang relevan"
            icon={<Sparkles className="w-4 h-4 text-amber" />}
          />
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

