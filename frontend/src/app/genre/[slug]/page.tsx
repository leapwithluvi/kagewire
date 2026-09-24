import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import { AdBanner } from '@/components/ads/AdBanner';
import { ArrowLeft } from 'lucide-react';
import { GenreClientView } from '@/components/genre/GenreClientView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const genres = await sankaApi.getGenreList();
  const currentGenre = genres.find((g) => g.slug === slug);
  const genreTitle = currentGenre ? currentGenre.name : slug.replace(/-/g, ' ').toUpperCase();

  return {
    title: `Genre ${genreTitle} — Anime | KageWire`,
    description: `Temukan koleksi anime terbaik dalam genre ${genreTitle} di KageWire.`,
  };
}

export const revalidate = 3600;

export default async function GenreDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.length > 100 || slug.includes('..') || slug.includes('/')) {
    notFound();
  }

  const [genres, firstPage] = await Promise.all([
    sankaApi.getGenreList(),
    sankaApi.getAnimeByGenre(slug, 1),
  ]);

  const currentGenre = genres.find((g) => g.slug === slug);
  const genreName = currentGenre?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  // Deduplicate initial list
  const seen = new Set<string>();
  const initialAnimeList = firstPage.animeList.filter((a) => {
    const key = a.animeId || a.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-content-primary pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/genre"
            className="inline-flex items-center gap-2 text-xs font-mono text-content-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Semua Genre</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="relative overflow-hidden mb-8 p-5 sm:p-6 rounded-xl bg-gradient-to-r from-surface-card via-surface-card/95 to-surface-secondary/70 border border-border-subtle shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber via-amber-light to-amber shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <div className="pl-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber font-semibold">
              Katalog Genre Anime
            </span>
            <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {genreName}
            </h1>
            {currentGenre?.description && (
              <p className="mt-2 text-xs sm:text-sm text-content-secondary max-w-2xl leading-relaxed">
                {currentGenre.description}
              </p>
            )}
          </div>
        </div>

        {/* Ad Banner */}
        <AdBanner slotId="anime-leaderboard" className="mb-8" />

        {/* Client-side view with pagination + filter */}
        <GenreClientView
          slug={slug}
          initialAnimeList={initialAnimeList}
          initialTotalPages={firstPage.totalPages}
          initialTotal={firstPage.total}
          genreName={genreName}
        />
      </div>
    </div>
  );
}
