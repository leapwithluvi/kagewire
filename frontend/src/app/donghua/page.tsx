import React from 'react';
import Link from 'next/link';
import { sankaApi } from '@/lib/sanka-api';
import MediaCard from '@/components/ui/MediaCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { AdBanner } from '@/components/ads/AdBanner';
import { Calendar, Sparkles, Flame, Clock } from 'lucide-react';

export const revalidate = 180;

export default async function DonghuaHubPage() {
  const donghuaData = await sankaApi.getDonghuaHome();

  const popular = donghuaData?.popular || [];
  const latest = donghuaData?.latest || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber">
            Katalog Konten
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-content-primary mt-1 tracking-tight">
            Animasi Donghua (Chinese 3D/2D)
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 max-w-xl">
            Kumpulan serial animasi Tiongkok bertema kultivasi dan aksi bela diri dengan visual sinematik tingkat tinggi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Link
            href="/donghua/list"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-border-subtle text-sm font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-all shadow-sm"
          >
            <span>Semua Donghua</span>
          </Link>
          <Link
            href="/donghua/ongoing"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-border-subtle text-sm font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>On-Going</span>
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-border-subtle text-sm font-semibold text-content-secondary hover:text-amber hover:border-amber/40 transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4 text-amber" />
            <span>Jadwal Tayang</span>
          </Link>
        </div>
      </div>

      {/* Leaderboard Ad */}
      <AdBanner slotId="donghua-leaderboard" className="mb-10" />

      {/* Popular Donghua: 4-5 items, swipeable on mobile */}
      <section className="mb-14">
        <SectionHeader
          title="Donghua Terpopuler"
          badge={`${Math.min(popular.length, 5)} Serial`}
          subtitle="Serial animasi 3D & 2D Tiongkok paling banyak disaksikan"
          icon={<Flame className="w-4 h-4 text-amber" />}
          actionHref="/donghua/ongoing"
          actionText="Semua Populer"
        />
        {popular.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-5 sm:overflow-visible snap-x snap-mandatory scrollbar-none">
            {popular.slice(0, 5).map((item) => (
              <div key={item.slug} className="min-w-[155px] sm:min-w-0 flex-shrink-0 snap-start">
                <MediaCard
                  id={item.slug}
                  title={item.title}
                  poster={item.poster}
                  type="donghua"
                  href={`/donghua/${item.slug}`}
                  rating={item.rating || '9.6'}
                  badge={item.status || 'Ongoing'}
                  subtitle={item.type || '3D Animation'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-content-muted surface-panel rounded-md">
            Sedang memuat data serial donghua...
          </div>
        )}
      </section>

      {/* MID STRIP: Multi-Banner Donghua Between Sections */}
      <AdBanner slotId="donghua-mid-strip" className="my-10" />

      {/* Latest Updates: Many items in standard responsive grid */}
      {latest.length > 0 && (
        <section className="mb-14">
          <SectionHeader
            title="Rilis Episode Terbaru"
            badge={`${latest.length} Update`}
            subtitle="Episode donghua baru dengan terjemahan subtitle Indonesia"
            icon={<Clock className="w-4 h-4 text-amber" />}
            actionHref="/donghua/list"
            actionText="Katalog Lengkap"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {latest.map((item) => (
              <MediaCard
                key={`latest-${item.slug}`}
                id={item.slug}
                title={item.title}
                poster={item.poster}
                type="donghua"
                href={`/donghua/${item.slug}`}
                badge="Update Baru"
                rating={item.rating}
                subtitle={item.status || 'Ongoing'}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
