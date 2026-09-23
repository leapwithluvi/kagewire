import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { Calendar } from 'lucide-react';

export const metadata = {
  title: 'Anime On-Going Sub Indo — KageWire',
  description: 'Daftar anime yang sedang tayang (on-going) subtitle Indonesia dengan pembaruan episode setiap minggu di KageWire.',
};

const DAYS = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

interface PageProps {
  searchParams: Promise<{ day?: string }>;
}

export default async function AnimeOngoingPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentDay = resolvedParams.day || 'Semua';

  const animeList = await sankaApi.getAnimeOngoing(currentDay === 'Semua' ? undefined : currentDay);

  return (
    <div className="min-h-screen bg-background text-content-primary pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Sedang Tayang
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-content-primary">
              Anime On-Going
            </h1>
            <p className="mt-2 text-sm text-content-secondary">
              Update episode terbaru setiap minggu dengan subtitle Indonesia terverifikasi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/anime/list"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-colors"
            >
              <span>Semua Anime</span>
            </Link>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-amber" />
              <span>Jadwal Tayang</span>
            </Link>
          </div>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {DAYS.map((day) => {
            const isSelected = currentDay.toLowerCase() === day.toLowerCase();
            const href = day === 'Semua' ? '/anime/ongoing' : `/anime/ongoing?day=${day}`;
            return (
              <Link
                key={day}
                href={href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber text-background shadow-md shadow-amber/20'
                    : 'bg-surface-card text-content-secondary hover:text-content-primary hover:bg-surface-secondary border border-border-subtle'
                }`}
              >
                {day}
              </Link>
            );
          })}
        </div>

        {/* Ad Placement */}
        <AdBanner slotId="anime-leaderboard" className="mb-8" />

        {/* Anime Grid */}
        {animeList.length === 0 ? (
          <div className="p-12 text-center rounded-lg border border-border-subtle bg-surface-card my-8">
            <p className="text-content-secondary text-sm">
              Tidak ada anime on-going yang tayang di hari {currentDay}.
            </p>
            <Link
              href="/anime/ongoing"
              className="mt-4 inline-block text-xs font-semibold text-amber hover:underline"
            >
              Lihat Semua Hari &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {animeList.map((anime, idx) => (
              <MediaCard
                key={`ongoing-anime-${anime.animeId || idx}-${idx}`}
                id={anime.animeId}
                title={anime.title}
                poster={anime.poster}
                type="anime"
                href={`/anime/otakudesu/${anime.animeId}`}
                badge={anime.episodes ? `Ep. ${anime.episodes}` : undefined}
                subtitle={anime.releaseDay ? `Hari ${anime.releaseDay}` : anime.releasedOn}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
