'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Fatal Global Error:', error);
  }, [error]);

  return (
    <html lang="id">
      <body className="bg-[#090a0f] text-[#f1f5f9] min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full text-center p-8 rounded-xl bg-[#12141c] border border-red-500/30 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center mb-6 border border-red-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold">
            Sistem Mengalami Gangguan
          </span>

          <h1 className="text-2xl font-bold text-white mt-2 mb-3">
            Terjadi Kesalahan Kritis
          </h1>

          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Terjadi kendala pada sistem rendering server atau jaringan. Silakan segarkan halaman atau kembali ke beranda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all border border-white/10"
            >
              <RefreshCcw className="w-4 h-4" />
              Muat Ulang Halaman
            </button>
            <a
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-black text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
            >
              <Home className="w-4 h-4" />
              Ke Beranda
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
