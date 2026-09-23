import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { Pagination } from '@/components/ui/Pagination';
import { AlphabetFilter } from '@/components/ui/AlphabetFilter';
import { Filter } from 'lucide-react';

export const metadata = {
  title: 'Daftar Semua Anime Sub Indo — KageWire',
  description: 'Katalog lengkap serial anime subtitle Indonesia berkualitas tinggi di KageWire.',
};

interface PageProps {
  searchParams: Promise<{ page?: string; letter?: string; status?: 'all' | 'ongoing' | 'complete' }>;
}

export default async function AnimeListPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const currentLetter = resolvedParams.letter || 'Semua';
  const currentStatus = resolvedParams.status || 'all';
  const limit = 24;

  const { animeList, total, totalPages } = await sankaApi.getAnimeList(currentPage, limit, currentStatus);

  // Filter berdasarkan huruf jika dipilih
  let displayedAnime = animeList;
  if (currentLetter !== 'Semua') {
    if (currentLetter === '#') {
      displayedAnime = animeList.filter((a) => /^[0-9]/.test(a.title.trim()));
    } else {
      displayedAnime = animeList.filter((a) =>
        a.title.trim().toUpperCase().startsWith(currentLetter.toUpperCase())
      );
    }
  }

  return (
    <div className="min-h-screen bg-background text-content-primary pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber font-semibold">
              Katalog Lengkap
            </span>
            <h1 className="mt-1 font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-content-primary">
              Semua Anime
            </h1>
            <p className="mt-2 text-sm text-content-secondary">
              Menampilkan {displayedAnime.length} dari {total} judul anime terindeks di sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/anime/list?status=all${currentLetter !== 'Semua' ? `&letter=${currentLetter}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStatus === 'all'
                  ? 'bg-amber text-black shadow-sm'
                  : 'bg-surface-card border border-border-subtle text-content-secondary hover:text-amber'
              }`}
            >
              Semua Anime
            </Link>
            <Link
              href={`/anime/list?status=ongoing${currentLetter !== 'Semua' ? `&letter=${currentLetter}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStatus === 'ongoing'
                  ? 'bg-amber text-black shadow-sm'
                  : 'bg-surface-card border border-border-subtle text-content-secondary hover:text-amber'
              }`}
            >
              Sedang Tayang (On-Going)
            </Link>
            <Link
              href={`/anime/list?status=complete${currentLetter !== 'Semua' ? `&letter=${currentLetter}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStatus === 'complete'
                  ? 'bg-amber text-black shadow-sm'
                  : 'bg-surface-card border border-border-subtle text-content-secondary hover:text-amber'
              }`}
            >
              Tamat (Completed)
            </Link>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber transition-colors"
            >
              <span>Jadwal Rilis</span>
            </Link>
            <Link
              href="/genre"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-amber" />
              <span>Filter Genre</span>
            </Link>
          </div>
        </div>

        {/* Alphabetical A-Z Filter Bar */}
        <div className="mb-6 bg-surface-main p-3 rounded-lg border border-border-subtle">
          <AlphabetFilter
            currentLetter={currentLetter}
            baseUrl="/anime/list"
          />
        </div>

        {/* Ad Placement */}
        <AdBanner slotId="anime-leaderboard" className="mb-8" />

        {/* Media Grid */}
        {displayedAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedAnime.map((anime, idx) => (
              <MediaCard
                key={`anime-${anime.animeId || idx}-${idx}`}
                id={anime.animeId}
                title={anime.title}
                poster={anime.poster}
                type="anime"
                href={`/anime/otakudesu/${anime.animeId}`}
                badge={anime.episodes ? `Ep. ${anime.episodes}` : undefined}
                subtitle={anime.releaseDay ? `Hari ${anime.releaseDay}` : undefined}
                releaseDay={anime.releaseDay}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl bg-surface-card border border-border-subtle text-content-muted text-sm">
            Tidak ada judul anime yang cocok pada halaman ini.
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/anime/list"
          searchParams={{
            letter: currentLetter !== 'Semua' ? currentLetter : undefined,
            status: currentStatus !== 'all' ? currentStatus : undefined,
          }}
          className="mt-12"
        />
      </div>
    </div>
  );
}
