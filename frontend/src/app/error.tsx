'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-lg bg-status-error/20 text-status-error flex items-center justify-center mb-6 border border-status-error/20">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-content-primary">
        Terjadi Kendala Koneksi
      </h1>
      <p className="text-xs sm:text-sm text-content-secondary max-w-md mt-2 mb-8 leading-relaxed">
        Gagal mengambil data dari server atau server penyedia konten sedang mengalami lonjakan trafik.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-surface-card border border-border-subtle hover:border-amber/40 text-content-primary text-xs sm:text-sm font-semibold transition-all"
        >
          <RefreshCcw className="w-4 h-4" /> Coba Lagi
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-amber hover:bg-amber-hover text-black text-xs sm:text-sm font-bold shadow-subtle transition-all"
        >
          <Home className="w-4 h-4" /> Beranda
        </Link>
      </div>
    </div>
  );
}
