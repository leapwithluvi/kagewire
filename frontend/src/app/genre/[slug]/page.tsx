import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const genres = await sankaApi.getGenreList();
  const currentGenre = genres.find((g) => g.slug === slug);
  const genreTitle = currentGenre ? currentGenre.name : slug.replace(/-/g, ' ').toUpperCase();

  return {
    title: `Genre ${genreTitle} — Anime, Donghua & Komik | KageWire`,
    description: `Temukan koleksi anime, donghua, dan manga terbaik dalam genre ${genreTitle} di KageWire.`,
  };
}

export default async function GenreDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const genres = await sankaApi.getGenreList();
  const currentGenre = genres.find((g) => g.slug === slug);

  const [rawAnimeList, rawComicList, rawDonghuaList] = await Promise.all([
    sankaApi.getAnimeByGenre(slug),
    sankaApi.getComicPopular(),
    sankaApi.getDonghuaOngoing(),
  ]);

  // Deduplicate to avoid React duplicate key warnings
  const seenAnime = new Set<string>();
  const animeList = rawAnimeList.filter((a) => {
    if (seenAnime.has(a.animeId)) return false;
    seenAnime.add(a.animeId);
    return true;
  });

  const seenDonghua = new Set<string>();
  const donghuaList = rawDonghuaList.filter((d) => {
    if (seenDonghua.has(d.slug)) return false;
    seenDonghua.add(d.slug);
    return true;
  });

  const seenComic = new Set<string>();
  const comicList = rawComicList.filter((c) => {
    if (seenComic.has(c.manga_id)) return false;
    seenComic.add(c.manga_id);
    return true;
  });

  const genreName = currentGenre?.name || slug.replace(/-/g, ' ').toUpperCase();

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

        {/* Header */}
        <div className="mb-8 border-b border-border-subtle pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber font-semibold">
            Katalog Genre
          </span>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-content-primary">
            {genreName}
          </h1>
          {currentGenre?.description && (
            <p className="mt-2 text-sm text-content-secondary max-w-2xl leading-relaxed">
              {currentGenre.description}
            </p>
          )}
        </div>

        {/* Ad Banner */}
        <AdBanner slotId="anime-leaderboard" className="mb-10" />

        {/* Anime Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-content-primary">
              Anime Terkait ({animeList.length})
            </h2>
            <Link
              href="/anime/list"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber/10 border border-amber/30 text-xs font-bold text-amber hover:bg-amber hover:text-black transition-all shadow-sm shrink-0"
            >
              <span>Lihat Semua Anime</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {animeList.map((anime, idx) => (
              <MediaCard
                key={`anime-${anime.animeId || idx}-${idx}`}
                id={anime.animeId}
                title={anime.title}
                poster={anime.poster}
                type="anime"
                href={`/anime/otakudesu/${anime.animeId}`}
                badge={anime.episodes ? `Ep. ${anime.episodes}` : undefined}
                subtitle={anime.releaseDay ? `Hari ${anime.releaseDay}` : undefined}
              />
            ))}
          </div>
        </div>

        {/* Donghua Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-content-primary">
              Donghua Populer
            </h2>
            <Link
              href="/donghua/list"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-400/10 border border-sky-400/30 text-xs font-bold text-sky-400 hover:bg-sky-400 hover:text-black transition-all shadow-sm shrink-0"
            >
              <span>Lihat Semua Donghua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {donghuaList.slice(0, 6).map((item, idx) => (
              <MediaCard
                key={`donghua-${item.slug || idx}-${idx}`}
                id={item.slug}
                title={item.title}
                poster={item.poster}
                type="donghua"
                href={`/donghua/${item.slug}`}
                badge={item.episodes ? `Ep. ${item.episodes}` : undefined}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        {/* Comic Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-content-primary">
              Komik & Manhwa Terkait
            </h2>
            <Link
              href="/comic/list"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-xs font-bold text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all shadow-sm shrink-0"
            >
              <span>Lihat Semua Komik</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {comicList.slice(0, 6).map((item, idx) => (
              <MediaCard
                key={`comic-${item.manga_id || idx}-${idx}`}
                id={item.manga_id}
                title={item.title}
                poster={item.cover_portrait || item.cover}
                type="comic"
                href={`/comic/${item.manga_id}`}
                badge={item.latest_chapter ? `Ch. ${item.latest_chapter}` : undefined}
                rating={item.rating}
                subtitle={item.format}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
