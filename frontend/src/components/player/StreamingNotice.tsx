'use client';

import React, { useState } from 'react';
import {
  Info,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  FileWarning,
  Sparkles,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface StreamingNoticeProps {
  title: string;
}

export function StreamingNotice({ title }: StreamingNoticeProps) {
  const [reported, setReported] = useState(false);
  const [reportReason, setReportReason] = useState('Video tidak bisa diputar / Layar Hitam');
  const [showModal, setShowModal] = useState(false);

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReported(true);
    setTimeout(() => {
      setShowModal(false);
    }, 1500);
  };

  return (
    <>
      <div className="my-8 space-y-4">
        {/* Main Grid: Streaming Guide + Issue Reporting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* 1. Panduan Nonton & Tips Buffering (2 Cols) */}
          <div className="md:col-span-2 p-5 rounded-xl border border-border-subtle bg-surface-card space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-amber font-semibold text-xs uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Panduan Streaming &amp; Troubleshooting</span>
            </div>

            <ul className="text-xs text-content-secondary space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber font-bold shrink-0 mt-0.5">•</span>
                <span>
                  <strong>Video Buffering / Macet?</strong> Ganti server pemutar melalui menu <strong>Pilih Server</strong> di atas player (pilih <em>OK.ru</em>, <em>DesuStream</em>, <em>Terabox</em>, atau <em>OneDrive</em>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber font-bold shrink-0 mt-0.5">•</span>
                <span>
                  <strong>Layar Hitam / Blank?</strong> Matikan ekstensi <em>Adblocker / Brave Shields</em> untuk situs player atau muat ulang halaman dengan tombol <strong>Ctrl + Shift + R</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber font-bold shrink-0 mt-0.5">•</span>
                <span>
                  <strong>Buka di Tab Baru:</strong> Klik tombol ikon eksternal di pojok kanan atas pemutar untuk memutar langsung dari server penyedia video.
                </span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-content-muted border-t border-border-subtle">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber" />
                Format: MP4 (H.264 / AAC)
              </span>
              <span>•</span>
              <span>Subtitle: Hardsub Bahasa Indonesia</span>
              <span>•</span>
              <span>Resolusi: 360p – 1080p FHD</span>
            </div>
          </div>

          {/* 2. Lapor Video Rusak / Link Mati (1 Col) */}
          <div className="p-5 rounded-xl border border-border-subtle bg-surface-card flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Lapor Masalah</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Menemukan video rusak, salah episode, atau link streaming mati? Laporkan agar segera diperbaiki oleh uploader kami.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold text-rose-400 transition-all active:scale-95"
              >
                <FileWarning className="w-4 h-4" />
                <span>Lapor Link / Video Rusak</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Disclaimer / DMCA Notice Resmi Web Bajakan/Streaming */}
        <div className="p-4 rounded-xl bg-surface-secondary/50 border border-border-subtle text-[11px] text-content-muted leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-content-muted shrink-0 mt-0.5" />
          <p>
            <strong>Disclaimer Hak Cipta:</strong> KageWire tidak menyimpan atau mengunggah file video media di server sendiri. Semua konten media yang ditampilkan disematkan (embed) dari penyedia pihak ketiga yang tersedia secara publik di internet. Jika Anda adalah pemilik hak cipta dan ingin mengajukan permohonan penghapusan, hubungi kami melalui halaman periklanan &amp; kontak.
          </p>
        </div>
      </div>

      {/* Modal Lapor Link Rusak */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-xl bg-surface-card border border-border-subtle p-6 shadow-2xl space-y-4">
            <h3 className="font-editorial text-lg font-bold text-content-primary">
              Lapor Link / Episode Rusak
            </h3>
            <p className="text-xs text-content-secondary">
              Episode: <strong className="text-content-primary">{title}</strong>
            </p>

            {reported ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-content-primary">Laporan Diterima!</p>
                <p className="text-xs text-content-muted">
                  Terima kasih atas bantuan Anda. Tim kami akan segera memeriksa dan memperbarui link episode ini.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1.5">
                    Jenis Masalah:
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-surface-main border border-border-subtle text-xs text-content-primary focus:border-amber focus:outline-none"
                  >
                    <option value="Video tidak bisa diputar / Layar Hitam">Video tidak bisa diputar / Layar Hitam</option>
                    <option value="Subtitle tidak sinkron / hilang">Subtitle tidak sinkron / hilang</option>
                    <option value="Semua server streaming mati">Semua server streaming mati</option>
                    <option value="Salah episode / video tertukar">Salah episode / video tertukar</option>
                    <option value="Link download mati / limit">Link download mati / limit</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-surface-secondary text-xs font-semibold text-content-secondary hover:text-content-primary transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber hover:bg-amber-hover text-black text-xs font-bold transition-all shadow-sm"
                  >
                    Kirim Laporan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
