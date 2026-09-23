import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface-main mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="space-y-3 sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md overflow-hidden bg-surface-secondary flex items-center justify-center border border-border-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/kage-chan.svg"
                  alt="Kage-chan Mascot"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-extrabold text-base tracking-wider text-content-primary">
                KAGEWIRE
              </span>
            </div>
            <p className="text-xs text-content-secondary max-w-sm leading-relaxed">
              Platform katalog multimedia dan pemutaran konten sinematik untuk serial Anime, animasi Donghua, dan pembaca komik digital dengan estetika editorial modern.
            </p>
            <div className="pt-2">
              <Link
                href="/advertise"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber/10 border border-amber/30 text-amber text-xs font-semibold hover:bg-amber hover:text-background transition-all"
              >
                <span>Pasang Iklan Mulai Rp 100.000 &rarr;</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-content-primary mb-3">
              Katalog Lengkap
            </h4>
            <ul className="space-y-2 text-xs text-content-secondary">
              <li>
                <Link href="/anime/list" className="hover:text-amber transition-colors">
                  Daftar Semua Anime
                </Link>
              </li>
              <li>
                <Link href="/donghua/list" className="hover:text-amber transition-colors">
                  Daftar Semua Donghua
                </Link>
              </li>
              <li>
                <Link href="/comic/list" className="hover:text-amber transition-colors">
                  Daftar Semua Komik
                </Link>
              </li>
              <li>
                <Link href="/genre" className="hover:text-amber transition-colors">
                  Indeks Genre
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-amber transition-colors">
                  Jadwal Rilis Anime
                </Link>
              </li>
              <li>
                <Link href="/comic/schedule" className="hover:text-amber text-amber font-semibold transition-colors">
                  Jadwal Rilis Komik
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-content-primary mb-3">
              Sedang Tayang
            </h4>
            <ul className="space-y-2 text-xs text-content-secondary">
              <li>
                <Link href="/anime/ongoing" className="hover:text-amber transition-colors">
                  Anime On-Going
                </Link>
              </li>
              <li>
                <Link href="/donghua/ongoing" className="hover:text-amber transition-colors">
                  Donghua On-Going
                </Link>
              </li>
              <li>
                <Link href="/comic/ongoing" className="hover:text-amber transition-colors">
                  Komik On-Going
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-amber transition-colors">
                  Daftar Simpanan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-content-primary mb-3">
              Kemitraan
            </h4>
            <ul className="space-y-2 text-xs text-content-secondary">
              <li>
                <Link href="/advertise" className="text-amber font-semibold hover:underline">
                  Sewa Slot Iklan (IDR)
                </Link>
              </li>
              <li>
                <Link href="/advertise?slot=home-billboard" className="hover:text-amber transition-colors">
                  Billboard Utama
                </Link>
              </li>
              <li>
                <a href="mailto:ads@kagewire.com" className="hover:text-amber transition-colors font-mono">
                  ads@kagewire.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-muted">
          <p>© {new Date().getFullYear()} KageWire. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1.5">
            <span>Ditenagai oleh</span>
            <a
              href="https://www.sankavollerei.web.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-content-secondary hover:text-amber font-semibold transition-colors"
            >
              SankaApi Platform
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
