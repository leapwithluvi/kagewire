import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { Pagination } from '@/components/ui/Pagination';
import { AlphabetFilter } from '@/components/ui/AlphabetFilter';
import { Sparkles, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Daftar Semua Donghua Sub Indo — KageWire',
  description: 'Koleksi lengkap serial animasi China (donghua) 3D dan 2D subtitle Indonesia berkualitas tinggi di KageWire.',
};

interface PageProps {
  searchParams: Promise<{ page?: string; letter?: string; status?: 'all' | 'ongoing' | 'completed' }>;
}

export default async function DonghuaListPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const currentLetter = resolvedParams.letter || 'Semua';
  const currentStatus = resolvedParams.status || 'all';
  const limit = 24;

  const { donghuaList, total, totalPages } = await sankaApi.getDonghuaList(currentPage, limit, currentStatus);

  let displayedDonghua = donghuaList;
  if (currentLetter !== 'Semua') {
    if (currentLetter === '#') {
      displayedDonghua = donghuaList.filter((d) => /^[0-9]/.test(d.title.trim()));
    } else {
      displayedDonghua = donghuaList.filter((d) =>
        d.title.trim().toUpperCase().startsWith(currentLetter.toUpperCase())
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
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
                Katalog Donghua Lengkap
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-content-primary">
              Semua Donghua 3D &amp; 2D
            </h1>
            <p className="mt-2 text-sm text-content-secondary">
              Menampilkan {displayedDonghua.length} dari {total} serial animasi China terindeks di sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/donghua/list?status=all${currentLetter !== 'Semua' ? `&letter=${currentLetter}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStatus === 'all'
                  ? 'bg-sky-400 text-black shadow-sm'
                  : 'bg-surface-card border border-border-subtle text-content-secondary hover:text-sky-400'
              }`}
            >
              Semua Donghua
            </Link>
            <Link
              href={`/donghua/list?status=ongoing${currentLetter !== 'Semua' ? `&letter=${currentLetter}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStatus === 'ongoing'
                  ? 'bg-sky-400 text-black shadow-sm'
                  : 'bg-surface-card border border-border-subtle text-content-secondary hover:text-sky-400'
              }`}
            >
              Sedang Tayang (On-Going)
            </Link>
            <Link
              href={`/donghua/list?status=completed${currentLetter !== 'Semua' ? `&letter=${currentLetter}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStatus === 'completed'
                  ? 'bg-sky-400 text-black shadow-sm'
                  : 'bg-surface-card border border-border-subtle text-content-secondary hover:text-sky-400'
              }`}
            >
              Tamat (Completed)
            </Link>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-sky-400 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Jadwal Tayang</span>
            </Link>
          </div>
        </div>

        {/* Alphabetical A-Z Filter Bar */}
        <div className="mb-6 bg-surface-main p-3 rounded-lg border border-border-subtle">
          <AlphabetFilter
            currentLetter={currentLetter}
            baseUrl="/donghua/list"
          />
        </div>

        {/* Ad Placement */}
        <AdBanner slotId="donghua-leaderboard" className="mb-8" />

        {/* Donghua Grid */}
        {displayedDonghua.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedDonghua.map((item, idx) => (
              <MediaCard
                key={`donghua-${item.slug || idx}-${idx}`}
                id={item.slug}
                title={item.title}
                poster={item.poster}
                type="donghua"
                href={`/donghua/${item.slug}`}
                badge={item.episodes ? `Ep. ${item.episodes}` : undefined}
                rating={item.rating || '9.6'}
                subtitle={item.status || item.type || '3D Animation'}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl bg-surface-card border border-border-subtle text-content-muted text-sm">
            Tidak ada judul donghua yang cocok pada halaman ini.
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/donghua/list"
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
