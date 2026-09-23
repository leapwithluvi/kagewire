'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function StickyTopAd() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-surface-main/95 backdrop-blur-md border-b border-border-subtle shadow-sm animate-in slide-in-from-top duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4" style={{ minHeight: '90px' }}>

        {/* Ad Slot Area */}
        <Link
          href="/advertise?slot=sticky-top"
          className="group flex-1 flex items-center justify-center gap-6 h-full py-3"
        >
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-content-muted mb-0.5">
              IKLAN MELAYANG ATAS — LEADERBOARD
            </span>
            <span className="text-sm sm:text-lg font-bold font-mono text-amber group-hover:text-amber-light transition-colors">
              Ukuran: 728 × 90 px (Desktop) / 320 × 50 px (Mobile)
            </span>
            <span className="text-[11px] text-content-secondary group-hover:text-amber transition-colors mt-0.5">
              Pasang Iklan di Sini &rarr;
            </span>
          </div>
        </Link>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded text-content-muted hover:text-content-primary hover:bg-surface-secondary transition-colors shrink-0"
          title="Tutup banner atas"
          aria-label="Tutup banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
