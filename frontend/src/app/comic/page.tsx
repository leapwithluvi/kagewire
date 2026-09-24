import React from 'react';
import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { AdBanner } from '@/components/ads/AdBanner';
import { Flame, Clock, BookOpen, Sparkles, Calendar } from 'lucide-react';

import type { Metadata } from 'next';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Komik, Manga, Manhwa & Manhua Sub Indo Terlengkap',
  description:
    'Baca ribuan judul komik, manga Jepang, manhwa Korea, dan manhua China terjemahan bahasa Indonesia terlengkap dan terupdate setiap hari secara gratis di KageWire.',
  keywords: [
    'baca komik',
    'baca manga sub indo',
    'baca manhwa',
    'baca manhua',
    'komik populer',
    'komik terbaru',
    'komik sub indo',
  ],
  openGraph: {
    title: 'Komik, Manga, Manhwa & Manhua Sub Indo | KageWire',
    description:
      'Baca komik, manga, manhwa & manhua bahasa Indonesia terlengkap dan terupdate setiap hari gratis.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Komik & Manga Sub Indo | KageWire',
    description: 'Baca komik manga & manhwa terjemahan bahasa Indonesia terlengkap.',
  },
};

export default async function ComicHubPage() {
  const [popularComics, latestComics] = await Promise.all([
    sankaApi.getComicPopular(),
    sankaApi.getComicLatest(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber">
            Katalog Konten
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-content-primary mt-1 tracking-tight">
            Manga, Manhwa & Manhua
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 max-w-xl">
            Koleksi komik Jepang (Manga), Korea (Manhwa), dan Tiongkok (Manhua) terlengkap dengan pembaca webtoon modern.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Link
            href="/comic/list"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-border-subtle text-sm font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-all shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-amber" />
            <span>Semua Komik</span>
          </Link>
          <Link
            href="/comic/ongoing"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-border-subtle text-sm font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber" />
            <span>On-Going</span>
          </Link>
          <Link
            href="/comic/schedule"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber/10 border border-amber/30 text-sm font-bold text-amber hover:bg-amber hover:text-background transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Jadwal Komik</span>
          </Link>
          <Link
            href="/genre"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-border-subtle text-sm font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-all shadow-sm"
          >
            <span>Genre</span>
          </Link>
        </div>
      </div>

      {/* Leaderboard Ad */}
      <AdBanner slotId="comic-leaderboard" className="mb-10" />

      {/* Popular Comics: standard responsive grid (2-cols on mobile) */}
      <section className="mb-14">
        <SectionHeader
          title="Komik Terpopuler Minggu Ini"
          badge={`${Math.min(popularComics.length, 10)} Judul`}
          subtitle="Manhwa, Manga, dan Manhua terfavorit dengan pembaca terbanyak"
          icon={<Flame className="w-4 h-4 text-amber" />}
          actionHref="/comic/ongoing"
          actionText="Semua Populer"
        />
        {popularComics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularComics.slice(0, 10).map((comic) => (
              <MediaCard
                key={comic.manga_id}
                id={comic.manga_id}
                title={comic.title}
                poster={comic.cover_portrait || comic.cover}
                type="comic"
                href={`/comic/${comic.manga_id}`}
                rating={comic.rating}
                badge={comic.latest_chapter ? `Ch. ${comic.latest_chapter}` : undefined}
                subtitle={comic.format || 'Manhwa'}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-content-muted surface-panel rounded-md">
            Sedang memuat komik terpopuler...
          </div>
        )}
      </section>

      {/* MID STRIP: Multi-Banner Komik Between Sections */}
      <AdBanner slotId="comic-mid-strip" className="my-10" />

      {/* Latest Updates: Many items in standard responsive grid */}
      {latestComics.length > 0 && (
        <section className="mb-14">
          <SectionHeader
            title="Chapter Terbaru Rilis"
            badge={`${latestComics.length} Update`}
            subtitle="Update terjemahan chapter komik bahasa Indonesia hari ini"
            icon={<Clock className="w-4 h-4 text-amber" />}
            actionHref="/comic/list"
            actionText="Katalog Komik"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {latestComics.map((comic) => (
              <MediaCard
                key={`latest-${comic.manga_id}`}
                id={comic.manga_id}
                title={comic.title}
                poster={comic.cover_portrait || comic.cover}
                type="comic"
                href={`/comic/${comic.manga_id}`}
                badge={comic.latest_chapter ? `Ch. ${comic.latest_chapter}` : 'Update Baru'}
                subtitle={comic.format || 'Manga'}
                rating={comic.rating}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
