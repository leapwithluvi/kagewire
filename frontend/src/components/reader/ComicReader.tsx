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
  Download,
  ExternalLink,
  Check,
} from 'lucide-react';
import { ChapterReaderData } from '@/types/api';

interface ComicReaderProps {
  data: ChapterReaderData;
}

function extractSlug(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    return trimmed && trimmed !== '[object Object]' ? trimmed : null;
  }
  if (typeof val === 'object' && val !== null) {
    const obj = val as Record<string, unknown>;
    const candidate =
      obj.chapter_id ||
      obj.chapterId ||
      obj.id ||
      obj.slug ||
      obj.endpoint ||
      obj.manga_id ||
      obj.mangaId;
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
}

export default function ComicReader({ data }: ComicReaderProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const prevSlug = extractSlug(data.prev_chapter);
  const nextSlug = extractSlug(data.next_chapter);
  const mangaSlug = extractSlug(data.manga_id) || 'list';

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

  const handleDownloadChapter = () => {
    if (!data.images || data.images.length === 0) {
      alert('Tidak ada gambar yang dapat diunduh untuk chapter ini.');
      return;
    }
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);

    // Open first image or print window as PDF alternative
    if (window.confirm('Simpan chapter ini sebagai PDF atau buka gambar ukuran penuh? Klik OK untuk cetak / simpan halaman.')) {
      window.print();
    }
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
            href={`/comic/${mangaSlug}`}
            className="p-1.5 rounded-lg bg-surface-secondary text-content-secondary hover:text-content-primary hover:border-amber border border-border-subtle transition-colors shrink-0"
            title="Kembali ke detail komik"
            aria-label="Kembali ke detail komik"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate font-editorial">
              Chapter {data.chapter_number}{' '}
              {data.chapter_title ? `— ${data.chapter_title}` : ''}
            </h1>
            <p className="text-[10px] text-content-muted num-tabular">
              {data.total_images || data.images.length} Halaman Gambar
            </p>
          </div>
        </div>

        {/* Action Controls: Download & Zoom */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDownloadChapter}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
              downloadSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white'
            }`}
            title="Download / Simpan Chapter Ini"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Tersimpan</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh Chapter</span>
              </>
            )}
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1.5 bg-surface-secondary/80 p-0.5 rounded-lg border border-border-subtle">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
              className="p-1 rounded text-content-secondary hover:text-content-primary transition-colors"
              title="Perkecil"
              aria-label="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-content-secondary w-9 text-center num-tabular">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(125, z + 25))}
              className="p-1 rounded text-content-secondary hover:text-content-primary transition-colors"
              title="Perbesar"
              aria-label="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comic Strip Content */}
      <div className={`w-full ${maxWidthClass} transition-all duration-200 flex flex-col items-center mt-2`}>
        {data.images && data.images.length > 0 ? (
          data.images
            .filter((imgUrl) => typeof imgUrl === 'string' && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('/')))
            .map((imgUrl, index) => (
              <div key={index} className="w-full relative bg-surface-main border-b border-border-subtle/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Halaman ${index + 1}`}
                  className="w-full h-auto object-contain select-none block"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1 right-2 px-2 py-0.5 rounded bg-black/80 border border-border-subtle text-[10px] text-content-secondary num-tabular pointer-events-none">
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

      {/* Bottom Chapter Switcher & Download Navigation */}
      <div className="w-full max-w-2xl mx-auto px-4 mt-10">
        <div className="p-4 rounded-xl bg-surface-card border border-border-subtle shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          {prevSlug ? (
            <Link
              href={`/read/${prevSlug}`}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-surface-secondary border border-border-subtle text-content-primary hover:border-amber text-xs font-semibold transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-amber" /> Chapter Sebelumnya
            </Link>
          ) : (
            <div className="w-full sm:w-auto flex-1 text-center py-2.5 px-4 rounded-lg bg-surface-secondary/40 text-xs text-content-muted border border-border-subtle/40">
              Chapter Terawal
            </div>
          )}

          <button
            onClick={handleDownloadChapter}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" /> Unduh Chapter ({data.images.length} Halaman)
          </button>

          {nextSlug ? (
            <Link
              href={`/read/${nextSlug}`}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-amber hover:bg-amber-hover text-black text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              Chapter Selanjutnya <ChevronRight className="w-4 h-4 text-black" />
            </Link>
          ) : (
            <div className="w-full sm:w-auto flex-1 text-center py-2.5 px-4 rounded-lg bg-surface-secondary/40 text-xs text-content-muted border border-border-subtle/40">
              Chapter Terakhir
            </div>
          )}
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-surface-card text-content-primary border border-border-subtle shadow-cinematic hover:border-amber transition-all z-50 hover:scale-105 active:scale-95"
          title="Kembali Ke Atas"
          aria-label="Kembali Ke Atas"
        >
          <ArrowUp className="w-5 h-5 text-amber" />
        </button>
      )}
    </div>
  );
}
