import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import { Star, Play, Sparkles } from 'lucide-react';
import MediaCard from '@/components/ui/MediaCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { AdBanner } from '@/components/ads/AdBanner';
import { StackedDetailBanners } from '@/components/ads/StackedDetailBanners';
import { DetailPopupAd } from '@/components/ads/DetailPopupAd';
import { StickyFooterAd } from '@/components/ads/StickyFooterAd';
import { MediaItemListFilter } from '@/components/media/MediaItemListFilter';
import { getResolvedSynopsis } from '@/lib/synopsis-helper';

import type { Metadata } from 'next';

interface DonghuaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 300;

export async function generateMetadata({ params }: DonghuaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return { title: 'Donghua Detail' };

  const donghua = await sankaApi.getDonghuaDetail(slug);
  if (!donghua) return { title: 'Donghua Tidak Ditemukan' };

  let rawSynopsis = '';
  const sf = donghua.synopsis as any;
  if (typeof sf === 'string' && sf.trim()) rawSynopsis = sf.replace(/<[^>]*>/g, '').trim();
  const desc = rawSynopsis ? rawSynopsis.slice(0, 160) : `Nonton streaming donghua ${donghua.title} sub Indo gratis kualitas HD. Episode terbaru dan terlengkap di KageWire.`;

  return {
    title: `${donghua.title} Sub Indo — Streaming Donghua Lengkap`,
    description: desc,
    keywords: [
      donghua.title,
      `${donghua.title} sub indo`,
      'nonton donghua',
      'donghua sub indo',
      'streaming donghua',
    ],
    openGraph: {
      title: `${donghua.title} Sub Indo | KageWire`,
      description: desc,
      images: donghua.poster ? [{ url: donghua.poster, alt: donghua.title }] : [],
      type: 'video.tv_show',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${donghua.title} Sub Indo | KageWire`,
      description: desc,
      images: donghua.poster ? [donghua.poster] : [],
    },
  };
}

export default async function DonghuaDetailPage({ params }: DonghuaDetailPageProps) {
  const { slug } = await params;

  if (!slug || slug.length > 150 || slug.includes('/') || slug.includes('..')) {
    notFound();
  }

  const donghua = await sankaApi.getDonghuaDetail(slug);

  if (!donghua) {
    notFound();
  }

  const episodes = donghua.episodes || [];
  const recommendations = donghua.recommendations || [];

  let rawSynopsis = '';
  const rawSynopsisField = donghua.synopsis as any;
  if (typeof rawSynopsisField === 'string' && rawSynopsisField.trim()) {
    rawSynopsis = rawSynopsisField.replace(/<[^>]*>/g, '').trim();
  } else if (Array.isArray(rawSynopsisField)) {
    rawSynopsis = rawSynopsisField.map((p) => (typeof p === 'string' ? p.replace(/<[^>]*>/g, '').trim() : String(p))).join('\n\n');
  } else if (rawSynopsisField && Array.isArray(rawSynopsisField.paragraphs)) {
    rawSynopsis = rawSynopsisField.paragraphs.map((p: any) => String(p).replace(/<[^>]*>/g, '').trim()).join('\n\n');
  } else if ((donghua as any).sinopsis) {
    const s = (donghua as any).sinopsis;
    rawSynopsis = typeof s === 'string' ? s.replace(/<[^>]*>/g, '').trim() : Array.isArray(s) ? s.join('\n\n') : '';
  } else if ((donghua as any).description) {
    const d = (donghua as any).description;
    rawSynopsis = typeof d === 'string' ? d.replace(/<[^>]*>/g, '').trim() : Array.isArray(d) ? d.join('\n\n') : '';
  }

  const genreNames = (donghua.genres || []).map((g: any) => (typeof g === 'string' ? g : g.name || g.title || ''));
  const synopsisText = getResolvedSynopsis(
    donghua.title,
    'donghua',
    rawSynopsis,
    genreNames,
    (donghua.info as any)?.Status || (donghua.info as any)?.status || ''
  );

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kagewire.vercel.app';
  const pageUrl = `${siteUrl}/donghua/${slug}`;

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
                name: donghua.title,
                description: synopsisText,
                image: donghua.poster,
                genre: genreNames,
                inLanguage: 'zh',
                subtitleLanguage: 'id',
                numberOfEpisodes: episodes.length || undefined,
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
                    name: 'Donghua',
                    item: `${siteUrl}/donghua`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: donghua.title,
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
                src={donghua.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'}
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

            {episodes.length > 0 && (() => {
              // Find episode 1 or oldest episode (usually at the end of descending array)
              const firstEp =
                [...episodes].reverse().find((e) => {
                  const num = e.episode || (e.title && e.title.match(/(?:episode|eps)\s*(\d+)/i)?.[1]);
                  return Number(num) === 1;
                }) || episodes[episodes.length - 1] || episodes[0];

              return (
                <Link
                  href={`/donghua/watch/${firstEp.slug || firstEp.episode || 1}`}
                  className="mt-4 w-56 sm:w-64 md:w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-amber to-amber-hover text-background text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber/25"
                >
                  <Play className="w-4 h-4 fill-background" />
                  <span>Mulai Nonton Episode 1</span>
                </Link>
              );
            })()}
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
            {donghua.info && typeof donghua.info === 'object' && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-content-secondary">
                {Object.entries(donghua.info).map(([key, val]) => {
                  const rawVal = val as any;
                  const displayVal =
                    typeof rawVal === 'string' || typeof rawVal === 'number'
                      ? String(rawVal)
                      : Array.isArray(rawVal)
                      ? rawVal.join(', ')
                      : typeof rawVal === 'object' && rawVal !== null
                      ? rawVal.name || rawVal.title || ''
                      : '';
                  if (!displayVal) return null;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded border border-border-subtle"
                    >
                      <span className="text-content-muted capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-semibold text-content-primary">{displayVal}</span>
                    </div>
                  );
                })}
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
                    {typeof g === 'string' ? g : (g as any).name || (g as any).title || String(g)}
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

        {/* 3. Mid-Content Leaderboard Ad */}
        <AdBanner slotId="donghua-mid-strip" className="my-10" />

        {/* Episode List Section with Search & Batch Filter */}
        <section className="mb-14">
          <MediaItemListFilter
            items={episodes.map((ep, idx) => {
              // Robust episode number detection from title, slug, or explicit number
              let epNum: number | null = null;
              if (typeof ep.episode === 'number' && !isNaN(ep.episode)) {
                epNum = ep.episode;
              } else {
                const combined = `${ep.slug || ''} ${ep.title || ''} ${ep.episode || ''}`;
                const match = combined.match(/(?:episode|eps|ep)[\s._-]*(\d+)/i) || combined.match(/(\d+)/);
                if (match && match[1]) {
                  epNum = parseInt(match[1], 10);
                } else {
                  epNum = episodes.length - idx;
                }
              }

              const epSlug =
                ep.slug ||
                (typeof ep.episode === 'string' && ep.episode.includes('-') ? ep.episode : `${slug}-episode-${epNum}`);

              return {
                id: `${epSlug}-${idx}`,
                title: `Episode ${epNum}`,
                href: `/donghua/watch/${epSlug}`,
                subtitle: ep.date || undefined,
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
        {recommendations.length > 0 && (
          <section>
            <SectionHeader
              title="Rekomendasi Donghua Lainnya"
              badge={`${recommendations.length} Judul`}
              subtitle="Pilihan donghua serupa dengan tema dan ranah kultivasi yang sama"
              icon={<Sparkles className="w-4 h-4 text-amber" />}
            />
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
