'use client';

import React from 'react';
import Link from 'next/link';

interface StackedDetailBannersProps {
  className?: string;
}

export function StackedDetailBanners({ className = '' }: StackedDetailBannersProps) {
  const slots = [
    { id: '1', dimensions: '728 × 90 px' },
    { id: '2', dimensions: '728 × 90 px' },
    { id: '3', dimensions: '728 × 90 px' },
    { id: '4', dimensions: '728 × 90 px' },
  ];

  return (
    <div className={`w-full my-4 sm:my-6 ${className}`}>
      {/* 4 Stacked Leaderboard Banner Slots — Slim on mobile (min-h-[46px]), full height on desktop (90px) */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {slots.map((item) => (
          <Link
            key={item.id}
            href={`/advertise?slot=detail-stacked`}
            className="group relative flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3.5 min-h-[46px] sm:min-h-[80px] lg:min-h-[90px] rounded-lg border-2 border-dashed border-border-highlight bg-surface-secondary/70 hover:border-amber/50 hover:bg-surface-hover transition-all"
            title={`Slot Iklan Leaderboard #${item.id} (${item.dimensions})`}
          >
            {/* Left: Slot number & Label */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded bg-surface-main text-content-muted font-mono text-[10px] sm:text-[11px] font-bold border border-border-subtle shrink-0">
                #{item.id}
              </span>
              <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-content-muted leading-tight">
                  SLOT IKLAN LEADERBOARD
                </span>
                <span className="text-xs sm:text-base font-bold font-mono text-amber group-hover:text-amber-light transition-colors leading-tight">
                  Ukuran: {item.dimensions}
                </span>
              </div>
            </div>

            {/* Right: CTA */}
            <span className="text-[11px] sm:text-xs font-semibold text-content-secondary group-hover:text-amber transition-colors whitespace-nowrap ml-2 sm:ml-4">
              <span className="hidden sm:inline">Pasang Iklan di Sini &rarr;</span>
              <span className="sm:hidden text-amber">Sewa &rarr;</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
