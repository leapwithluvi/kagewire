import React from 'react';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { Search } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  let animeResults: any[] = [];
  let donghuaResults: any[] = [];
  let comicResults: any[] = [];

  if (query) {
    const [anime, donghua, comic] = await Promise.all([
      sankaApi.searchAnime(query),
      sankaApi.searchDonghua(query),
      sankaApi.searchComic(query),
    ]);
    animeResults = anime || [];
    donghuaResults = donghua || [];
    comicResults = comic || [];
  }

  const totalResults =
    animeResults.length + donghuaResults.length + comicResults.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="mb-10 border-b border-border-subtle pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber">
          Pencarian
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-content-primary mt-1 tracking-tight">
          {query ? `Hasil untuk "${query}"` : 'Cari Konten'}
        </h1>
        {query && (
          <p className="text-xs sm:text-sm text-content-secondary mt-1">
            Ditemukan <span className="text-content-primary font-semibold num-tabular">{totalResults}</span> hasil di seluruh Anime, Donghua, dan Komik
          </p>
        )}
      </div>

      <AdBanner slotId="search-sidebar" className="mb-8" />

      {!query ? (
        <div className="p-16 text-center surface-panel rounded-md">
          <Search className="w-12 h-12 text-amber mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-content-primary">
            Ketik kata kunci untuk memulai pencarian
          </p>
          <p className="text-xs text-content-muted mt-1">
            Cari berdasarkan judul anime, donghua, atau judul komik favorit Anda.
          </p>
        </div>
      ) : totalResults === 0 ? (
        <div className="p-16 text-center surface-panel rounded-md">
          <Search className="w-12 h-12 text-amber mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-content-primary">
            Tidak ditemukan hasil untuk &quot;{query}&quot;
          </p>
          <p className="text-xs text-content-muted mt-1">
            Coba gunakan kata kunci yang lebih umum atau judul asli dalam bahasa Jepang/Inggris/Indonesia.
          </p>
        </div>
      ) : (
        <div className="space-y-14">
          {/* Anime Results */}
          {animeResults.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between mb-5 border-b border-border-subtle pb-3">
                <h2 className="font-editorial text-xl font-normal text-content-primary">
                  Anime <span className="text-content-muted text-sm font-sans">({animeResults.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {animeResults.map((item, idx) => (
                  <MediaCard
                    key={`anime-${item.animeId || idx}`}
                    id={item.animeId || `${idx}`}
                    title={item.title}
                    poster={item.poster}
                    type="anime"
                    href={`/anime/otakudesu/${item.animeId || item.href?.split('/').filter(Boolean).pop()}`}
                    badge={item.episodes ? `Ep. ${item.episodes}` : undefined}
                    rating={item.score}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Donghua Results */}
          {donghuaResults.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between mb-5 border-b border-border-subtle pb-3">
                <h2 className="font-editorial text-xl font-normal text-content-primary">
                  Donghua <span className="text-content-muted text-sm font-sans">({donghuaResults.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {donghuaResults.map((item, idx) => (
                  <MediaCard
                    key={`donghua-${item.slug || idx}`}
                    id={item.slug || `${idx}`}
                    title={item.title}
                    poster={item.poster}
                    type="donghua"
                    href={`/donghua/${item.slug}`}
                    rating={item.rating}
                    badge={item.status || 'Donghua'}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Comic Results */}
          {comicResults.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between mb-5 border-b border-border-subtle pb-3">
                <h2 className="font-editorial text-xl font-normal text-content-primary">
                  Manga & Manhwa <span className="text-content-muted text-sm font-sans">({comicResults.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {comicResults.map((item, idx) => (
                  <MediaCard
                    key={`comic-${item.manga_id || idx}`}
                    id={item.manga_id || `${idx}`}
                    title={item.title}
                    poster={item.cover_portrait || item.cover}
                    type="comic"
                    href={`/comic/${item.manga_id}`}
                    badge={item.latest_chapter ? `Ch. ${item.latest_chapter}` : undefined}
                    subtitle={item.format || 'Manhwa'}
                    rating={item.rating}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
