import React from 'react';
import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { Calendar, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnimeHubPage() {
  const [otakudesuData, samehadakuData] = await Promise.all([
    sankaApi.getAnimeHome(),
    sankaApi.getAnimeSamehadakuHome(),
  ]);

  const ongoingList = otakudesuData?.ongoing?.animeList || [];
  const completedList = otakudesuData?.completed?.animeList || [];
  const samehadakuRecent = samehadakuData?.recent?.animeList || [];

  // Gabungkan anime ongoing dari Otakudesu dan update episode baru dari Samehadaku
  const seenIds = new Set<string>();
  const combinedOngoing: Array<{
    key: string;
    id: string;
    title: string;
    poster: string;
    href: string;
    badge?: string;
    subtitle?: string;
    releaseDay?: string;
    rating?: string | number;
  }> = [];

  ongoingList.forEach((anime) => {
    seenIds.add(anime.animeId.toLowerCase().replace(/[^a-z0-9]/g, ''));
    combinedOngoing.push({
      key: `otaku-${anime.animeId}`,
      id: anime.animeId,
      title: anime.title,
      poster: anime.poster,
      href: `/anime/otakudesu/${anime.animeId}`,
      badge: anime.episodes ? `Ep. ${anime.episodes}` : anime.latestReleaseDate,
      subtitle: anime.releasedOn || (anime.releaseDay ? `Hari ${anime.releaseDay}` : undefined),
      releaseDay: anime.releaseDay,
      rating: undefined,
    });
  });

  samehadakuRecent.forEach((anime) => {
    const norm = anime.animeId.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenIds.has(norm)) {
      seenIds.add(norm);
      combinedOngoing.push({
        key: `same-${anime.animeId}`,
        id: anime.animeId,
        title: anime.title,
        poster: anime.poster,
        href: `/anime/samehadaku/${anime.animeId}`,
        badge: anime.episodes ? `Ep. ${anime.episodes}` : 'Baru',
        subtitle: anime.releasedOn,
        releaseDay: undefined,
        rating: undefined,
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber">
            Katalog Konten
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-content-primary mt-1 tracking-tight">
            Koleksi Serial Anime
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 max-w-xl">
            Rilisan episode harian terlengkap dengan subtitle Indonesia kualitas Full HD.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Link
            href="/anime/list"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-border-subtle text-sm font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-all shadow-sm"
          >
            <span>Semua Anime</span>
          </Link>
          <Link
            href="/anime/ongoing"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-border-subtle text-sm font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber" />
            <span>On-Going</span>
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-border-subtle text-sm font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4 text-amber" />
            <span>Jadwal Tayang</span>
          </Link>
        </div>
      </div>

      {/* Leaderboard Ad */}
      <AdBanner slotId="anime-leaderboard" className="mb-10" />

      {/* Unified Sedang Tayang & Update Terbaru Section */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between mb-5 border-b border-border-subtle pb-3">
          <h2 className="font-editorial text-xl font-normal text-content-primary">
            Sedang Tayang & Update Terbaru (Ongoing)
          </h2>
          <span className="text-xs text-content-muted num-tabular">
            {combinedOngoing.length} Judul
          </span>
        </div>
        {combinedOngoing.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {combinedOngoing.map((anime) => (
              <MediaCard
                key={anime.key}
                id={anime.id}
                title={anime.title}
                poster={anime.poster}
                type="anime"
                href={anime.href}
                badge={anime.badge}
                subtitle={anime.subtitle}
                releaseDay={anime.releaseDay}
                rating={anime.rating}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-content-muted surface-panel rounded-md">
            Tidak ada data anime ongoing saat ini.
          </div>
        )}
      </section>

      {/* MID STRIP: Multi-Banner Between Sections */}
      <AdBanner slotId="anime-mid-strip" className="my-10" />

      {/* Completed Anime (Tamat) */}
      {completedList.length > 0 && (
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-5 border-b border-border-subtle pb-3">
            <h2 className="font-editorial text-xl font-normal text-content-primary">
              Anime Tamat (Completed)
            </h2>
            <span className="text-xs text-content-muted num-tabular">
              {completedList.length} Judul
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {completedList.map((anime) => (
              <MediaCard
                key={anime.animeId}
                id={anime.animeId}
                title={anime.title}
                poster={anime.poster}
                type="anime"
                href={`/anime/otakudesu/${anime.animeId}`}
                badge={anime.episodes ? `${anime.episodes} Ep` : 'Tamat'}
                rating={anime.latestReleaseDate || undefined}
                subtitle="Complete"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
