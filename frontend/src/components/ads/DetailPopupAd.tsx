'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface DetailPopupAdProps {
  slug?: string;
  delayMs?: number;
  initialCountdown?: number;
}

export function DetailPopupAd({
  slug = 'detail',
  delayMs = 400,
  initialCountdown = 5,
}: DetailPopupAdProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    // Reset countdown and open popup after short delay on mount / slug change
    setCountdown(initialCountdown);
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [slug, delayMs, initialCountdown]);

  useEffect(() => {
    if (!isOpen) return;

    if (countdown <= 0) {
      setIsOpen(false);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, countdown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-[600px] overflow-hidden rounded-lg border border-border-subtle bg-surface-card shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-surface-main border-b border-border-subtle text-xs">
          <span className="font-mono text-[11px] text-content-muted">
            Slot Iklan Pop-Up Interstitial
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded text-content-muted hover:text-content-primary hover:bg-surface-secondary transition-colors"
            title="Tutup iklan"
            aria-label="Tutup iklan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ad Area */}
        <Link
          href="/advertise?slot=popup-ad"
          onClick={handleClose}
          className="group relative flex flex-col items-center justify-center aspect-[600/350] w-full p-6 text-center border-b border-border-subtle bg-surface-secondary/50 hover:bg-surface-secondary transition-colors"
        >
          <div className="p-6 rounded-lg border-2 border-dashed border-border-highlight group-hover:border-amber/50 flex flex-col items-center justify-center gap-2 w-full h-full">
            <span className="text-xs uppercase font-mono tracking-widest text-content-muted">
              SLOT IKLAN POP-UP
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber">
              Ukuran: 600 × 350 px
            </div>
            <span className="text-xs text-content-secondary mt-1">
              Pasang Iklan di Sini &rarr;
            </span>
          </div>
        </Link>

        {/* Countdown Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="w-full py-3 px-4 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-inner"
        >
          <span>Tutup Iklan (otomatis tutup dalam {countdown} detik)</span>
        </button>
      </div>
    </div>
  );
}
