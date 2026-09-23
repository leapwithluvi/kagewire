'use client';

import React from 'react';
import Link from 'next/link';
import { getAdSlot } from '@/lib/ads-config';

interface AdBannerProps {
  slotId: string;
  className?: string;
}

export function AdBanner({ slotId, className = '' }: AdBannerProps) {
  const slot = getAdSlot(slotId);

  if (!slot) {
    return null;
  }

  // --- MULTI-STRIP BANNER (2 or 3 Banners side-by-side) ---
  if (slot.format === 'multi-strip') {
    const maxItems = slot.maxBanners || 3;

    return (
      <div className={`relative w-full my-4 sm:my-6 ${className}`}>
        <div
          className={`grid gap-2 sm:gap-3 ${
            maxItems === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {Array.from({ length: maxItems }).map((_, idx) => (
            <Link
              key={idx}
              href={`/advertise?slot=${slot.slotId}`}
              className="group relative flex flex-col justify-center items-center rounded-lg border-2 border-dashed border-border-highlight bg-surface-card/60 hover:border-amber/50 hover:bg-surface-secondary transition-all px-3 py-2.5 sm:p-5 min-h-[56px] sm:min-h-[110px] lg:min-h-[120px]"
            >
              <div className="flex items-center gap-2 sm:flex-col sm:gap-1 sm:mb-1.5">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-main text-content-muted border border-border-subtle">
                  Slot #{idx + 1}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-content-muted">
                  SLOT IKLAN STRIP
                </span>
              </div>
              <span className="text-xs sm:text-base font-bold font-mono text-amber">
                Ukuran: {slot.dimensions}
              </span>
              <span className="text-[10px] sm:text-xs text-content-secondary group-hover:text-amber transition-colors mt-0.5 sm:mt-2 hidden sm:inline">
                Pasang Iklan di Sini &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // --- RECTANGLE (300×250) ---
  if (slot.format === 'rectangle') {
    return (
      <div className={`relative mx-auto my-6 flex flex-col items-center ${className}`}>
        <Link
          href={`/advertise?slot=${slot.slotId}`}
          className="group relative overflow-hidden rounded-lg border-2 border-dashed border-border-highlight bg-surface-card/60 hover:border-amber/50 hover:bg-surface-secondary transition-all flex flex-col items-center justify-center text-center"
          style={{ width: '300px', minHeight: '250px' }}
        >
          <span className="text-[11px] uppercase font-mono tracking-widest text-content-muted mb-2">
            SLOT IKLAN RECTANGLE
          </span>
          <div className="text-base sm:text-xl font-bold font-mono text-amber">
            Ukuran: {slot.dimensions}
          </div>
          <span className="text-xs text-content-secondary group-hover:text-amber transition-colors mt-2">
            Pasang Iklan di Sini &rarr;
          </span>
        </Link>
      </div>
    );
  }

  // --- BILLBOARD (970×250) ---
  if (slot.format === 'billboard') {
    return (
      <div className={`relative w-full my-6 ${className}`}>
        <Link
          href={`/advertise?slot=${slot.slotId}`}
          className="group relative w-full overflow-hidden rounded-lg border-2 border-dashed border-border-highlight bg-surface-card/60 hover:border-amber/50 hover:bg-surface-secondary transition-all flex flex-col items-center justify-center text-center px-4 py-6 min-h-[160px] sm:min-h-[220px] lg:min-h-[250px]"
        >
          <span className="text-[11px] uppercase font-mono tracking-widest text-content-muted mb-2">
            SLOT IKLAN BILLBOARD
          </span>
          <div className="text-base sm:text-2xl font-bold font-mono text-amber">
            Ukuran: {slot.dimensions}
          </div>
          <span className="text-xs text-content-secondary group-hover:text-amber transition-colors mt-2">
            Pasang Iklan di Sini &rarr;
          </span>
        </Link>
      </div>
    );
  }

  // --- LEADERBOARD (728×90) — Slim on mobile (min-h-[48px]), full on desktop (90px) ---
  return (
    <div className={`relative w-full my-3 sm:my-6 ${className}`}>
      <Link
        href={`/advertise?slot=${slot.slotId}`}
        className="group relative w-full overflow-hidden rounded-lg border-2 border-dashed border-border-highlight bg-surface-card/60 hover:border-amber/50 hover:bg-surface-secondary transition-all flex items-center justify-between px-3.5 sm:px-6 py-2 sm:py-3.5 min-h-[48px] sm:min-h-[80px] lg:min-h-[90px]"
      >
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[11px] uppercase font-mono tracking-wider text-content-muted leading-tight">
            SLOT IKLAN LEADERBOARD
          </span>
          <div className="text-xs sm:text-lg font-bold font-mono text-amber mt-0.5 leading-tight">
            Ukuran: {slot.dimensions}
          </div>
        </div>
        <span className="text-[11px] sm:text-xs text-content-secondary group-hover:text-amber transition-colors whitespace-nowrap ml-3 sm:ml-4">
          <span className="hidden sm:inline">Pasang Iklan di Sini &rarr;</span>
          <span className="sm:hidden text-amber font-semibold">Sewa &rarr;</span>
        </span>
      </Link>
    </div>
  );
}
