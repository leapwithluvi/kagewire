import React from 'react';
import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import SectionHeader from '@/components/ui/SectionHeader';
import SpotlightBanner from '@/components/home/SpotlightBanner';
import { AdBanner } from '@/components/ads/AdBanner';
import { getResolvedSynopsis } from '@/lib/synopsis-helper';
import { ChevronRight, ArrowRight, Calendar, Sparkles, BookOpen, Layers, Film, Megaphone } from 'lucide-react';

import type { Metadata } from 'next';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'KageWire — Platform Streaming Anime, Donghua & Baca Komik Sub Indo',
  description:
    'Portal hiburan kurasi editorial anime sub Indo (Otakudesu & Samehadaku), streaming donghua resolusi HD, dan komik manga, manhwa & manhua terlengkap bahasa Indonesia.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const [animeData, donghuaData, comicData] = await Promise.all([
    sankaApi.getAnimeHome(),
    sankaApi.getDonghuaHome(),
    sankaApi.getComicPopular(),
  ]);

  const ongoingAnime = animeData?.ongoing?.animeList?.slice(0, 10) || [];
  const donghuaSlider = donghuaData?.slider || [];
  const donghuaPopular = donghuaData?.popular?.slice(0, 10) || [];
  const popularComics = comicData?.slice(0, 10) || [];

  // Prepare Spotlight items with real/mock data (Donghua + Anime + Komik)
  const spotlightItems = [
    ...donghuaSlider.slice(0, 3).map((d) => ({
      id: d.slug,
      title: d.title,
      poster: d.poster,
      synopsis: getResolvedSynopsis(d.title, 'donghua', d.synopsis),
      type: 'donghua' as const,
      href: `/donghua/${d.slug}`,
      rating: '9.8',
    })),
    ...ongoingAnime.slice(0, 3).map((a) => ({
      id: a.animeId,
      title: a.title,
      poster: a.poster,
      synopsis: getResolvedSynopsis(a.title, 'anime'),
      type: 'anime' as const,
      href: `/anime/otakudesu/${a.animeId}`,
      rating: '8.9',
    })),
    ...popularComics.slice(0, 2).map((c) => ({
      id: c.manga_id,
      title: c.title,
      poster: c.cover_portrait || c.cover,
      synopsis: getResolvedSynopsis(c.title, 'comic', c.description),
      type: 'comic' as const,
      href: `/comic/${c.manga_id}`,
      rating: c.rating ? String(c.rating) : '9.5',
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Featured Spotlight Banner */}
      {spotlightItems.length > 0 && <SpotlightBanner items={spotlightItems} />}

      {/* Quick Category Navigation Bar - Stacks downwards in grid on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center gap-2.5 sm:gap-3 my-6">
        <Link
          href="/schedule"
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2.5 rounded-lg bg-amber/10 border border-amber/30 text-sm font-bold text-amber hover:bg-amber hover:text-background transition-all shadow-sm"
        >
          <Calendar className="w-4 h-4 text-amber" />
          <span>Jadwal Rilis</span>
        </Link>
        <Link
          href="/genre"
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2.5 rounded-lg bg-surface-card border border-border-subtle hover:border-amber/40 text-sm font-semibold text-content-primary hover:text-amber transition-all shadow-sm"
        >
          <Layers className="w-4 h-4 text-amber" />
          <span>Daftar Genre</span>
        </Link>
        <Link
          href="/anime/list"
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2.5 rounded-lg bg-surface-card border border-border-subtle hover:border-amber/40 text-sm font-semibold text-content-primary hover:text-amber transition-all shadow-sm"
        >
          <Film className="w-4 h-4 text-amber" />
          <span>Katalog Anime</span>
        </Link>
        <Link
          href="/donghua/list"
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2.5 rounded-lg bg-surface-card border border-border-subtle hover:border-sky-400/40 text-sm font-semibold text-content-primary hover:text-sky-400 transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Katalog Donghua</span>
        </Link>
        <Link
          href="/comic/list"
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2.5 rounded-lg bg-surface-card border border-border-subtle hover:border-emerald-400/40 text-sm font-semibold text-content-primary hover:text-emerald-400 transition-all shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Katalog Komik</span>
        </Link>
        <Link
          href="/advertise"
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2.5 rounded-lg bg-surface-card border border-amber/30 hover:border-amber text-sm font-bold text-amber hover:bg-amber hover:text-background transition-all shadow-sm"
        >
          <Megaphone className="w-4 h-4 text-amber" />
          <span>Pasang Iklan</span>
        </Link>
      </div>

      {/* Featured Ad Billboard */}
      <AdBanner slotId="home-billboard" className="my-8" />

      {/* SECTION 1: Anime Ongoing Terbaru */}
      <section className="mb-14">
        <SectionHeader
          title="Anime Ongoing Terbaru"
          badge={`${ongoingAnime.length} Judul`}
          subtitle="Rilis mingguan dengan terjemahan bahasa Indonesia kualitas Full HD"
          icon={<Sparkles className="w-4 h-4 text-amber" />}
          actionHref="/anime"
          actionText="Lihat Semua"
        />

        {ongoingAnime.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ongoingAnime.map((anime) => (
                <MediaCard
                  key={anime.animeId}
                  id={anime.animeId}
                  title={anime.title}
                  poster={anime.poster}
                  type="anime"
                  href={`/anime/otakudesu/${anime.animeId}`}
                  badge={anime.episodes ? `Ep. ${anime.episodes}` : anime.latestReleaseDate}
                  subtitle={anime.releasedOn}
                  releaseDay={anime.releaseDay}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href="/anime"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-surface-card hover:bg-amber/10 border border-border-subtle hover:border-amber/40 text-content-primary hover:text-amber font-semibold text-xs sm:text-sm transition-all duration-200 group shadow-sm active:scale-98"
              >
                <span>Lihat Semua Anime Ongoing</span>
                <ArrowRight className="w-4 h-4 text-amber group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        ) : (
          <div className="p-10 text-center text-xs text-content-muted surface-panel rounded-md">
            Sedang memuat data serial anime ongoing...
          </div>
        )}
      </section>

      {/* MULTI-BANNER STRIP: 3 Sponsor Banners Side-by-Side */}
      <AdBanner slotId="home-mid-strip" className="my-12" />

      {/* SECTION 2: Donghua Trending */}
      <section className="mb-14">
        <SectionHeader
          title="Donghua Terpopuler (Chinese 3D/2D)"
          badge={`${donghuaPopular.length} Serial`}
          subtitle="Petualangan kultivasi dan animasi sinematik Tiongkok paling diminati"
          icon={<Film className="w-4 h-4 text-amber" />}
          actionHref="/donghua"
          actionText="Lihat Semua"
        />

        {donghuaPopular.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {donghuaPopular.map((d) => (
                <MediaCard
                  key={d.slug}
                  id={d.slug}
                  title={d.title}
                  poster={d.poster}
                  type="donghua"
                  href={`/donghua/${d.slug}`}
                  rating={d.rating || '9.5'}
                  badge={d.status || 'Ongoing'}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href="/donghua"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-surface-card hover:bg-sky-400/10 border border-border-subtle hover:border-sky-400/40 text-content-primary hover:text-sky-400 font-semibold text-xs sm:text-sm transition-all duration-200 group shadow-sm active:scale-98"
              >
                <span>Lihat Semua Donghua Terpopuler</span>
                <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        ) : (
          <div className="p-10 text-center text-xs text-content-muted surface-panel rounded-md">
            Sedang memuat serial donghua populer...
          </div>
        )}
      </section>

      {/* SECTION 3: Manga & Manhwa Populer */}
      <section className="mb-14">
        <SectionHeader
          title="Manga & Manhwa Pilihan"
          badge={`${popularComics.length} Judul`}
          subtitle="Komik dengan rating tinggi dan chapter terbaru yang paling banyak dibaca"
          icon={<BookOpen className="w-4 h-4 text-amber" />}
          actionHref="/comic"
          actionText="Lihat Semua"
        />

        {popularComics.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularComics.map((comic) => (
                <MediaCard
                  key={comic.manga_id}
                  id={comic.manga_id}
                  title={comic.title}
                  poster={comic.cover_portrait || comic.cover}
                  type="comic"
                  href={`/comic/${comic.manga_id}`}
                  badge={comic.latest_chapter ? `Ch. ${comic.latest_chapter}` : undefined}
                  rating={comic.rating}
                  subtitle={comic.format || 'Manhwa'}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href="/comic"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-surface-card hover:bg-emerald-400/10 border border-border-subtle hover:border-emerald-400/40 text-content-primary hover:text-emerald-400 font-semibold text-xs sm:text-sm transition-all duration-200 group shadow-sm active:scale-98"
              >
                <span>Lihat Semua Komik & Manhwa</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        ) : (
          <div className="p-10 text-center text-xs text-content-muted surface-panel rounded-md">
            Sedang memuat komik terpopuler...
          </div>
        )}
      </section>

      {/* BOTTOM BILLBOARD: Additional Large Banner Slot */}
      <AdBanner slotId="home-bottom-banner" className="my-8" />
    </div>
  );
}
