'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface SpotlightItem {
  id: string;
  title: string;
  poster: string;
  synopsis: string;
  type: 'anime' | 'donghua' | 'comic';
  href: string;
  rating?: string | number;
}

interface SpotlightBannerProps {
  items: SpotlightItem[];
}

export default function SpotlightBanner({ items }: SpotlightBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] rounded-lg overflow-hidden mb-12 border border-border-subtle group bg-surface-main">
      {/* Background Poster Artwork with Ambient Glow */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`bg-${current.poster || currentIndex}`}
        src={current.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80'}
        alt={current.title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 filter brightness-[0.4] scale-105"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80';
        }}
      />

      {/* Cinematic Editorial Overlays (Slate Neutral) */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/50" />

      {/* Content Container */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        <div className="max-w-2xl space-y-3.5 pb-4 sm:pb-0">
          {/* Metadata Bar */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-surface-secondary text-content-primary border border-border-subtle">
              {current.type}
            </span>
            {current.rating && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-secondary text-amber border border-border-subtle num-tabular">
                <Star className="w-3 h-3 fill-amber text-amber" />
                {current.rating}
              </span>
            )}
            <span className="text-xs text-content-muted">
              Pilihan Editor #{currentIndex + 1}
            </span>
          </div>

          {/* Editorial Display Title */}
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-content-primary leading-[1.1] tracking-tight">
            {current.title}
          </h1>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-content-secondary line-clamp-3 leading-relaxed max-w-xl">
            {current.synopsis}
          </p>

          {/* Action Button */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={current.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-amber hover:bg-amber-hover text-black text-xs sm:text-sm font-bold tracking-wide transition-all shadow-subtle active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Tonton Sekarang
            </Link>
          </div>
        </div>

        {/* Right Hero Poster Showcase (Desktop & Tablet) */}
        <div className="hidden md:block shrink-0 pl-8">
          <div className="relative w-44 lg:w-52 aspect-[3/4] rounded-lg overflow-hidden border border-border-subtle shadow-2xl shadow-black/80 transform hover:scale-105 transition-transform duration-300 group-hover:rotate-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`poster-${current.poster || currentIndex}`}
              src={current.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'}
              alt={current.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      <button
        onClick={() =>
          setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
        }
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-md bg-surface-main/80 text-content-secondary hover:text-content-primary border border-border-subtle transition-all opacity-0 group-hover:opacity-100"
        aria-label="Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-md bg-surface-main/80 text-content-secondary hover:text-content-primary border border-border-subtle transition-all opacity-0 group-hover:opacity-100"
        aria-label="Selanjutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Pagination Line / Dots */}
      <div className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all ${
              currentIndex === idx
                ? 'w-5 bg-amber'
                : 'w-1.5 bg-content-muted/40 hover:bg-content-muted'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
