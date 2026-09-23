import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import { AdBanner } from '@/components/ads/AdBanner';

export const metadata = {
  title: 'Daftar Genre Anime, Donghua & Komik — KageWire',
  description: 'Jelajahi ribuan anime, donghua, manga, dan manhwa berdasarkan genre favorit Anda di KageWire.',
};

export default async function GenreListPage() {
  const genres = await sankaApi.getGenreList();

  return (
    <div className="min-h-screen bg-background text-content-primary pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-amber font-semibold">
            Index & Taksonomi
          </span>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-content-primary">
            Daftar Genre
          </h1>
          <p className="mt-3 text-sm sm:text-base text-content-secondary leading-relaxed">
            Temukan tontonan dan bacaan berikutnya berdasarkan preferensi genre. Dari pertempuran laga xianxia hingga petualangan isekai fantasi.
          </p>
        </div>

        {/* Ad Placement */}
        <AdBanner slotId="home-billboard" className="mb-10" />

        {/* Genre Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <Link
              key={genre.slug}
              href={`/genre/${genre.slug}`}
              className="group relative flex flex-col justify-between p-5 rounded-lg border border-border-subtle bg-surface-card hover:bg-surface-secondary hover:border-amber/50 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-content-primary group-hover:text-amber transition-colors">
                    {genre.name}
                  </h3>
                  {genre.count && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-main text-content-muted border border-border-subtle">
                      {genre.count.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
                {genre.description && (
                  <p className="mt-2 text-xs text-content-secondary line-clamp-2 leading-relaxed">
                    {genre.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Jelajahi {genre.name}</span>
                <span aria-hidden="true">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
