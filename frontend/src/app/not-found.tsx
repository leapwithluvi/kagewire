import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <p className="font-editorial text-8xl sm:text-9xl font-normal text-border-highlight select-none">
          404
        </p>
      </div>
      <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-content-primary">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-xs sm:text-sm text-content-secondary max-w-md mt-2 mb-8 leading-relaxed">
        Anime, donghua, atau chapter komik yang Anda cari mungkin telah dipindahkan atau tautan sudah tidak aktif.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-amber hover:bg-amber-hover text-black text-xs sm:text-sm font-bold shadow-subtle transition-all"
      >
        <Home className="w-4 h-4" />
        Kembali ke Beranda
      </Link>
    </div>
  );
}
