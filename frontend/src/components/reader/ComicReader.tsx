'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  BookOpen,
} from 'lucide-react';
import { ChapterReaderData } from '@/types/api';

interface ComicReaderProps {
  data: ChapterReaderData;
}

export default function ComicReader({ data }: ComicReaderProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const maxWidthClass =
    zoomLevel === 75
      ? 'max-w-2xl'
      : zoomLevel === 125
      ? 'max-w-5xl'
      : 'max-w-3xl';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pb-24">
      {/* Sticky Top Header */}
      <div className="sticky top-16 z-40 w-full bg-surface-main/95 border-b border-border-subtle px-4 py-2.5 flex items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5 truncate">
          <Link
            href={`/comic/${data.manga_id}`}
            className="p-1 rounded bg-surface-secondary text-content-secondary hover:text-content-primary"
            title="Kembali ke detail komik"
            aria-label="Kembali ke detail komik"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-bold text-content-primary truncate font-editorial">
              Chapter {data.chapter_number}{' '}
              {data.chapter_title ? `— ${data.chapter_title}` : ''}
            </h1>
            <p className="text-[10px] text-content-muted num-tabular">
              {data.total_images || data.images.length} Halaman Gambar
            </p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
            className="p-1.5 rounded bg-surface-secondary text-content-secondary hover:text-content-primary transition-colors"
            title="Perkecil"
            aria-label="Perkecil"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-content-secondary w-9 text-center num-tabular">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(125, z + 25))}
            className="p-1.5 rounded bg-surface-secondary text-content-secondary hover:text-content-primary transition-colors"
            title="Perbesar"
            aria-label="Perbesar"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comic Strip Content */}
      <div className={`w-full ${maxWidthClass} transition-all duration-200 flex flex-col items-center mt-2`}>
        {data.images && data.images.length > 0 ? (
          data.images.map((imgUrl, index) => (
            <div key={index} className="w-full relative bg-surface-main border-b border-border-subtle/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={`Halaman ${index + 1}`}
                className="w-full h-auto object-contain select-none block"
                loading={index < 3 ? 'eager' : 'lazy'}
              />
              <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-content-secondary num-tabular pointer-events-none">
                {index + 1} / {data.images.length}
              </div>
            </div>
          ))
        ) : (
          <div className="p-16 text-center text-content-muted">
            <BookOpen className="w-10 h-10 text-amber mx-auto mb-3" />
            <p className="text-sm">Halaman gambar tidak ditemukan untuk chapter ini.</p>
          </div>
        )}
      </div>

      {/* Bottom Chapter Switcher Navigation */}
      <div className="w-full max-w-xl mx-auto px-4 mt-8 flex items-center justify-between gap-3">
        {data.prev_chapter ? (
          <Link
            href={`/read/${data.prev_chapter}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md bg-surface-secondary border border-border-subtle text-content-secondary hover:text-content-primary text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Chapter Sebelumnya
          </Link>
        ) : (
          <div className="flex-1 text-center py-2.5 text-xs text-content-muted">
            Chapter Terawal
          </div>
        )}

        <Link
          href={`/comic/${data.manga_id}`}
          className="px-3.5 py-2.5 rounded-md bg-surface-secondary text-content-secondary hover:text-content-primary text-xs font-semibold"
        >
          Daftar Chapter
        </Link>

        {data.next_chapter ? (
          <Link
            href={`/read/${data.next_chapter}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md bg-amber hover:bg-amber-hover text-black text-xs font-bold transition-colors"
          >
            Chapter Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <div className="flex-1 text-center py-2.5 text-xs text-content-muted">
            Chapter Terakhir
          </div>
        )}
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2.5 rounded-full bg-surface-secondary text-content-primary border border-border-subtle shadow-subtle hover:border-amber transition-all z-50"
          title="Ke Atas"
          aria-label="Ke Atas"
        >
          <ArrowUp className="w-4 h-4 text-amber" />
        </button>
      )}
    </div>
  );
}
