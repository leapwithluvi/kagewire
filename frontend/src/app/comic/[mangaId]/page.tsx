import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import { Star, BookOpen, Eye, Bookmark, Layers, Calendar } from 'lucide-react';
import { AdBanner } from '@/components/ads/AdBanner';
import { StackedDetailBanners } from '@/components/ads/StackedDetailBanners';
import { DetailPopupAd } from '@/components/ads/DetailPopupAd';
import { StickyFooterAd } from '@/components/ads/StickyFooterAd';
import { MediaItemListFilter } from '@/components/media/MediaItemListFilter';

interface ComicDetailPageProps {
  params: Promise<{
    mangaId: string;
  }>;
}

export const revalidate = 1800;

export default async function ComicDetailPage({ params }: ComicDetailPageProps) {
  const { mangaId } = await params;
  const [comic, chapters] = await Promise.all([
    sankaApi.getComicDetail(mangaId),
    sankaApi.getComicChapters(mangaId),
  ]);

  if (!comic) {
    notFound();
  }

  const chapterList = Array.isArray(chapters) ? chapters : [];

  return (
    <>
      {/* Iklan Melayang Bawah — hanya di halaman detail */}
      <StickyFooterAd />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 0. Detail Entrance Pop-up Interstitial (4s countdown) */}
        <DetailPopupAd slug={`comic-${mangaId}`} />

        {/* 1. Multi-Banner Stack (4 Baris Leaderboard 728x90px) */}
        <StackedDetailBanners className="mb-8" />

        {/* Top Details Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Left Column: Cover & Action */}
          <div className="flex flex-col items-center md:items-start w-full">
            <div className="relative aspect-[3/4] w-56 sm:w-64 md:w-full rounded-md overflow-hidden bg-surface-card border border-border-subtle shadow-cinematic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={comic.cover_portrait || comic.cover}
                alt={comic.title}
                className="w-full h-full object-cover"
              />
              {comic.rating && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-surface-main/90 text-amber text-xs font-bold border border-border-subtle num-tabular">
                  <Star className="w-3 h-3 fill-amber text-amber" />
                  {comic.rating}
                </div>
              )}
            </div>

            {chapterList.length > 0 && (
              <Link
                href={`/read/${chapterList[chapterList.length - 1].chapter_id}`}
                className="mt-4 w-56 sm:w-64 md:w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-amber to-amber-hover text-background text-xs font-bold shadow-md shadow-amber/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Mulai Baca Chapter 1</span>
              </Link>
            )}
          </div>

          {/* Right Column: Title, Metadata, Genres, Synopsis */}
          <div className="md:col-span-2 lg:col-span-3 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-surface-secondary text-content-secondary border border-border-subtle">
                  {comic.format || 'Manhwa'}
                </span>
                {comic.status && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-secondary text-content-muted border border-border-subtle">
                    {comic.status}
                  </span>
                )}
              </div>
              <h1 className="font-editorial text-2xl sm:text-4xl font-normal text-content-primary mt-2 leading-tight">
                {comic.title}
              </h1>
              {comic.alternative_title && (
                <p className="text-xs text-content-muted mt-1">
                  {comic.alternative_title}
                </p>
              )}
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-content-secondary">
              {comic.views != null && !isNaN(Number(comic.views)) && (
                <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded border border-border-subtle">
                  <Eye className="w-3 h-3 text-amber" />
                  <span className="num-tabular">{Number(comic.views).toLocaleString()} Views</span>
                </div>
              )}
              {comic.bookmarks != null && !isNaN(Number(comic.bookmarks)) && (
                <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded border border-border-subtle">
                  <Bookmark className="w-3 h-3 text-amber" />
                  <span className="num-tabular">{Number(comic.bookmarks).toLocaleString()} Bookmarks</span>
                </div>
              )}
              {comic.release_year && (
                <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded border border-border-subtle">
                  <Calendar className="w-3 h-3 text-amber" />
                  <span>Tahun {comic.release_year}</span>
                </div>
              )}
            </div>

            {/* Genre Badges */}
            {comic.genres && comic.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {comic.genres.map((g, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-secondary text-content-secondary border border-border-subtle"
                  >
                    {typeof g === 'string' ? g : g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                Sinopsis Cerita
              </h3>
              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed whitespace-pre-line max-w-3xl">
                {comic.description || 'Tidak ada deskripsi tersedia.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Mid-Content Leaderboard Ad */}
        <AdBanner slotId="comic-mid-strip" className="my-10" />

        {/* Chapter List Section with Search & Batch Filter */}
        <section className="mb-14">
          <MediaItemListFilter
            items={chapterList.map((ch) => ({
              id: ch.chapter_id,
              title: `Chapter ${ch.chapter_number}`,
              href: `/read/${ch.chapter_id}`,
              subtitle: ch.views != null && !isNaN(Number(ch.views))
                ? `${Number(ch.views).toLocaleString()} views`
                : ch.release_date || undefined,
              type: 'chapter' as const,
            }))}
            type="chapter"
            title="Daftar Chapter"
            initialSort="desc"
            batchSize={50}
          />
        </section>

        {/* 4. Bottom Leaderboard Ad */}
        <AdBanner slotId="detail-bottom-banner" className="my-10" />
      </div>
    </>
  );
}
