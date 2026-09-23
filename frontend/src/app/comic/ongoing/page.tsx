import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Komik & Manhwa On-Going Sub Indo — KageWire',
  description: 'Daftar komik manga, manhwa, dan manhua yang sedang berjalan dengan pembaruan bab setiap pekan di KageWire.',
};

export default async function ComicOngoingPage() {
  const comicList = await sankaApi.getComicOngoing();

  return (
    <div className="min-h-screen bg-background text-content-primary pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Sedang Berjalan
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-content-primary">
              Komik & Manhwa On-Going
            </h1>
            <p className="mt-2 text-sm text-content-secondary">
              Chapter baru rilis berkala dengan terjemahan bahasa Indonesia yang rapi dan nyaman dibaca.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/comic/list"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber" />
              <span>Semua Komik</span>
            </Link>
            <Link
              href="/genre"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-colors"
            >
              <span>Genre Komik</span>
            </Link>
          </div>
        </div>

        {/* Ad Placement */}
        <AdBanner slotId="comic-leaderboard" className="mb-8" />

        {/* Comic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {comicList.map((comic, idx) => (
            <MediaCard
              key={`ongoing-comic-${comic.manga_id || idx}-${idx}`}
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
      </div>
    </div>
  );
}
