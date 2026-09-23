import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { Sparkles, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Donghua On-Going Sub Indo — KageWire',
  description: 'Serial donghua ongoing animasi 3D dan 2D subtitle Indonesia terupdate setiap pekan di KageWire.',
};

export default async function DonghuaOngoingPage() {
  const donghuaList = await sankaApi.getDonghuaOngoing();

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
              Donghua On-Going
            </h1>
            <p className="mt-2 text-sm text-content-secondary">
              Serial animasi kultivasi, wuxia, dan sci-fi China yang rutin merilis episode baru.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/donghua/list"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-card border border-border-subtle text-xs font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-colors"
            >
              <span>Semua Donghua</span>
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

        {/* Ad Placement */}
        <AdBanner slotId="donghua-leaderboard" className="mb-8" />

        {/* Donghua Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {donghuaList.map((item, idx) => (
            <MediaCard
              key={`ongoing-donghua-${item.slug || idx}-${idx}`}
              id={item.slug}
              title={item.title}
              poster={item.poster}
              type="donghua"
              href={`/donghua/${item.slug}`}
              badge={item.episodes ? `Ep. ${item.episodes}` : undefined}
              rating={item.rating}
              subtitle="Ongoing"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
