import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { Pagination } from '@/components/ui/Pagination';
import { AlphabetFilter } from '@/components/ui/AlphabetFilter';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Daftar Semua Komik, Manhwa & Manga Sub Indo — KageWire',
  description: 'Katalog komik lengkap manga Jepang, manhwa Korea, dan manhua China subtitle Indonesia di KageWire.',
};

const FORMATS = ['Semua', 'Manhwa', 'Manhua', 'Manga'];

interface PageProps {
  searchParams: Promise<{ page?: string; format?: string; letter?: string }>;
}

export default async function ComicListPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const currentFormat = resolvedParams.format || 'Semua';
  const currentLetter = resolvedParams.letter || 'Semua';
  const limit = 24;

  const { comicList, total, totalPages } = await sankaApi.getComicList(
    currentPage,
    limit,
    currentFormat === 'Semua' ? undefined : currentFormat
  );

  let displayedComics = comicList;
  if (currentLetter !== 'Semua') {
    if (currentLetter === '#') {
      displayedComics = comicList.filter((c) => /^[0-9]/.test(c.title.trim()));
    } else {
      displayedComics = comicList.filter((c) =>
        c.title.trim().toUpperCase().startsWith(currentLetter.toUpperCase())
      );
    }
  }

  return (
    <div className="min-h-screen bg-background text-content-primary pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber" />
              <span className="text-xs font-mono uppercase tracking-widest text-amber font-semibold">
                Koleksi Bergambar Lengkap
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-content-primary">
              Semua Komik & Manhwa
            </h1>
            <p className="mt-2 text-sm text-content-secondary">
              Menampilkan {displayedComics.length} dari {total} komik (Manga, Manhwa, Manhua) terindeks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/comic/ongoing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-colors"
            >
              <span>On-Going Saja</span>
            </Link>
            <Link
              href="/genre"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-colors"
            >
              <span>Genre Komik</span>
            </Link>
          </div>
        </div>

        {/* Format Filter Pills */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {FORMATS.map((fmt) => {
            const isSelected = currentFormat.toLowerCase() === fmt.toLowerCase();
            const href = fmt === 'Semua' ? '/comic/list' : `/comic/list?format=${fmt}`;
            return (
              <Link
                key={fmt}
                href={href}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber text-background shadow-md shadow-amber/20'
                    : 'bg-surface-card text-content-secondary hover:text-content-primary hover:bg-surface-secondary border border-border-subtle'
                }`}
              >
                {fmt}
              </Link>
            );
          })}
        </div>

        {/* Alphabetical A-Z Filter Bar */}
        <div className="mb-6 bg-surface-main p-3 rounded-lg border border-border-subtle">
          <AlphabetFilter
            currentLetter={currentLetter}
            baseUrl="/comic/list"
            searchParams={{ format: currentFormat !== 'Semua' ? currentFormat : undefined }}
          />
        </div>

        {/* Ad Placement */}
        <AdBanner slotId="comic-leaderboard" className="mb-8" />

        {/* Comic Grid */}
        {displayedComics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedComics.map((comic, idx) => (
              <MediaCard
                key={`comic-${comic.manga_id || idx}-${idx}`}
                id={comic.manga_id}
                title={comic.title}
                poster={comic.cover_portrait || comic.cover}
                type="comic"
                href={`/comic/${comic.manga_id}`}
                badge={comic.latest_chapter ? `Ch. ${comic.latest_chapter}` : undefined}
                rating={comic.rating}
                subtitle={comic.format}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl bg-surface-card border border-border-subtle text-content-muted text-sm">
            Tidak ada judul komik yang berawalan huruf &quot;{currentLetter}&quot; pada halaman ini.
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/comic/list"
          searchParams={{
            format: currentFormat !== 'Semua' ? currentFormat : undefined,
            letter: currentLetter !== 'Semua' ? currentLetter : undefined,
          }}
          className="mt-12"
        />
      </div>
    </div>
  );
}
