'use client';

import React, { useState, use } from 'react';
import {
  AD_PACKAGES,
  COMBO_PACKAGES,
  BANNER_SPECIFICATIONS,
  PURCHASE_STEPS,
  formatIDR,
} from '@/lib/ads-config';
import {
  TrendingUp,
  Users,
  Eye,
  CheckCircle2,
  MessageCircle,
  Mail,
  ShieldCheck,
  Send,
  Zap,
  Layers,
  Sparkles,
  FileImage,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ slot?: string }>;
}

export default function AdvertisePage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const initialSlot = resolvedParams?.slot || AD_PACKAGES[0].slotId;

  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialSlot);
  const [duration, setDuration] = useState<'week' | 'month'>('month');
  const [advertiserName, setAdvertiserName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentSlot = AD_PACKAGES.find((s) => s.slotId === selectedSlotId) || AD_PACKAGES[0];
  const activePrice = duration === 'week' ? currentSlot.pricePerWeekIdr : currentSlot.pricePerMonthIdr;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Halo Tim KageWire, saya tertarik menyewa slot iklan:\n- Slot: ${currentSlot.title} (${currentSlot.dimensions})\n- Lokasi: ${currentSlot.location}\n- Durasi: ${duration === 'week' ? '1 Minggu' : '1 Bulan'}\n- Biaya Estimasi: ${formatIDR(activePrice)}\n- Nama/Brand: ${advertiserName || '-'}\n- Website/Target: ${websiteUrl || '-'}\n\nMohon info ketersediaan tanggal dan petunjuk pemasangannya. Terima kasih!`
  );

  return (
    <div className="min-h-screen bg-background text-content-primary pb-24 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-mono mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>KageWire Advertising Network</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-content-primary">
            Pasang Iklan & Promosikan Brand Anda
          </h1>
          <p className="mt-4 text-sm sm:text-base text-content-secondary leading-relaxed">
            Jangkau komunitas penggemar anime, pembaca komik, dan pecinta donghua terbesar di Indonesia dengan penempatan iklan yang estetik, tidak mengganggu, dan berkonversi tinggi.
          </p>
        </div>

        {/* Audience Stats Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            {
              icon: Eye,
              title: 'Tayangan Bulanan',
              value: '4.500.000+',
              desc: 'Total pageviews aktif per bulan',
            },
            {
              icon: Users,
              title: 'Pengunjung Unik',
              value: '850.000+',
              desc: 'Audiens aktif Indonesia (92%)',
            },
            {
              icon: TrendingUp,
              title: 'Rata-rata CTR Banner',
              value: '2.8% – 4.2%',
              desc: 'Efektivitas klik tinggi & terarah',
            },
            {
              icon: ShieldCheck,
              title: 'Zero Ad-Fraud',
              value: '100% Organik',
              desc: 'Lalu lintas bersih dari bot & spam',
            },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className="p-5 rounded-lg border border-border-subtle bg-surface-card flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-content-muted">
                    {metric.title}
                  </span>
                  <Icon className="w-4 h-4 text-amber" />
                </div>
                <div>
                  <div className="font-editorial text-2xl sm:text-3xl font-bold text-content-primary">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-xs text-content-secondary line-clamp-1">
                    {metric.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing & Slot Selection Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber font-semibold">
                Daftar Paket & Tarif Resmi
              </span>
              <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-content-primary">
                Pilih Slot Banner Iklan
              </h2>
            </div>

            {/* Duration Toggle */}
            <div className="inline-flex p-1 rounded-lg bg-surface-secondary border border-border-subtle">
              <button
                type="button"
                onClick={() => setDuration('week')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  duration === 'week'
                    ? 'bg-amber text-background shadow'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                1 Minggu
              </button>
              <button
                type="button"
                onClick={() => setDuration('month')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                  duration === 'month'
                    ? 'bg-amber text-background shadow'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                <span>1 Bulan</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-background/20 text-current">
                  Hemat 15%
                </span>
              </button>
            </div>
          </div>

          {/* COMBO PACKAGES: Pasang Sekaligus Banyak Slot Banner */}
          <div className="mb-10 p-6 rounded-xl border border-amber/30 bg-gradient-to-br from-amber/5 via-surface-card to-surface-secondary">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber" />
                <h3 className="text-base sm:text-lg font-bold text-content-primary">
                  Paket Bundling Multi-Banner (Pasang Banyak Slot Sekaligus)
                </h3>
              </div>
              <span className="text-xs font-mono text-amber bg-amber/10 px-2.5 py-0.5 rounded border border-amber/20">
                Diskon Bundling Spesial
              </span>
            </div>
            <p className="text-xs text-content-secondary mb-6 leading-relaxed">
              Ingin dominasi eksposur di seluruh halaman? Pilih paket multi-banner terpadu kami dengan harga hemat hingga 35%.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COMBO_PACKAGES.map((combo) => {
                const price = duration === 'week' ? combo.pricePerWeekIdr : combo.pricePerMonthIdr;
                return (
                  <div
                    key={combo.id}
                    onClick={() => {
                      setSelectedSlotId(combo.slotsIncluded[0]);
                      setNotes(`Tertarik Paket Bundling: ${combo.name} (${combo.slotsIncluded.join(', ')})`);
                    }}
                    className="p-5 rounded-lg border border-border-subtle bg-surface-main hover:border-amber/60 hover:bg-surface-secondary cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-amber/15 text-amber border border-amber/30">
                          {combo.badge}
                        </span>
                        <span className="text-[11px] font-mono text-content-muted">
                          {combo.slotsIncluded.length} Slot Banner
                        </span>
                      </div>
                      <h4 className="font-editorial text-base font-bold text-content-primary mt-1">
                        {combo.name}
                      </h4>
                      <p className="mt-2 text-xs text-content-secondary leading-relaxed">
                        {combo.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border-subtle flex items-end justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-content-muted block">
                          Tarif / {duration === 'week' ? 'Minggu' : 'Bulan'}
                        </span>
                        <span className="text-lg font-bold font-mono text-amber">
                          {formatIDR(price)}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-content-secondary group-hover:text-amber">
                        Pilih Bundle &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section subtitle for individual slots */}
          <div className="mb-4">
            <h3 className="font-editorial text-lg font-bold text-content-primary">
              Atau Pilih Slot Individual Mandiri:
            </h3>
          </div>

          {/* Cards Grid of Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AD_PACKAGES.map((pkg) => {
              const isSelected = selectedSlotId === pkg.slotId;
              const price = duration === 'week' ? pkg.pricePerWeekIdr : pkg.pricePerMonthIdr;

              return (
                <div
                  key={pkg.slotId}
                  onClick={() => setSelectedSlotId(pkg.slotId)}
                  className={`cursor-pointer rounded-lg border p-6 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-amber bg-surface-card shadow-lg shadow-amber/10 ring-1 ring-amber'
                      : 'border-border-subtle bg-surface-card/60 hover:bg-surface-card hover:border-border-highlight'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-surface-main text-content-secondary border border-border-subtle">
                        {pkg.dimensions}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Slot Tersedia
                      </span>
                    </div>

                    <h3 className="font-editorial text-xl font-bold text-content-primary mt-2">
                      {pkg.title}
                    </h3>
                    <p className="mt-1 text-xs text-amber font-mono line-clamp-1">
                      {pkg.location}
                    </p>
                    <p className="mt-3 text-xs text-content-secondary leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-subtle flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-content-muted block">
                        Biaya Sewa / {duration === 'week' ? 'Minggu' : 'Bulan'}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-content-primary font-mono">
                        {formatIDR(price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-amber text-background'
                          : 'bg-surface-secondary text-content-secondary hover:text-content-primary border border-border-subtle'
                      }`}
                    >
                      {isSelected ? 'Dipilih' : 'Pilih Slot'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CARA PASANG IKLAN (5 LANGKAH MUDAH) */}
        <div className="mb-16 rounded-xl border border-border-subtle bg-surface-card p-6 sm:p-8">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-amber font-semibold">
              Alur Transaksi & Penayangan
            </span>
            <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-content-primary">
              Cara Memasang Iklan di KageWire
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-content-secondary leading-relaxed">
              Proses reservasi dan penerbitan banner iklan dirancang cepat, transparan, dan tanpa birokrasi rumit. Ikuti 5 langkah mudah berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PURCHASE_STEPS.map((stepItem) => (
              <div
                key={stepItem.step}
                className="relative p-4 rounded-lg bg-surface-main border border-border-subtle hover:border-amber/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-amber/15 text-amber border border-amber/30 text-xs font-mono font-bold flex items-center justify-center">
                      {stepItem.step}
                    </span>
                    <span className="text-[10px] font-mono text-content-muted">
                      {stepItem.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-content-primary mb-2">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-content-secondary leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SPESIFIKASI TEKNIS & KETENTUAN MATERI BANNER */}
        <div className="mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-amber font-semibold">
              Standar Banner & Pedoman Kreatif
            </span>
            <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-content-primary">
              Spesifikasi Ukuran & Format File (Gambar & GIF)
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-content-secondary leading-relaxed">
              Agar materi iklan Anda tampil tajam dan memikat di seluruh perangkat (desktop, tablet, dan smartphone), pastikan berkas mengikuti ketentuan teknis berikut:
            </p>
          </div>

          {/* Table / Grid Specs */}
          <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface-card mb-8">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-secondary/70 text-content-primary font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Nama Slot & Format</th>
                  <th className="py-3.5 px-4">Ukuran Desktop</th>
                  <th className="py-3.5 px-4">Ukuran Mobile</th>
                  <th className="py-3.5 px-4">Format File</th>
                  <th className="py-3.5 px-4">Maks. File Size</th>
                  <th className="py-3.5 px-4">Catatan Desain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-content-secondary">
                {BANNER_SPECIFICATIONS.map((spec) => (
                  <tr key={spec.formatName} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-content-primary">
                      {spec.formatName}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber whitespace-nowrap">
                      {spec.dimensions}
                    </td>
                    <td className="py-3 px-4 font-mono text-content-secondary whitespace-nowrap">
                      {spec.mobileDimensions}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-main text-content-primary border border-border-subtle font-mono text-[11px]">
                        {spec.fileFormats}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400">
                      &le; {spec.maxFileSize}
                    </td>
                    <td className="py-3 px-4 text-content-muted leading-relaxed">
                      {spec.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rules / Policy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Kategori Iklan yang Sangat Direkomendasikan</span>
              </div>
              <ul className="space-y-1.5 text-xs text-content-secondary leading-relaxed">
                <li>• Top up game & voucher digital (Genshin, MLBB, HSR, Steam, dll).</li>
                <li>• Toko merchandise resmi, action figure, cosplay, dan apparel anime/komik.</li>
                <li>• Jasa kreatif: Web development, ilustrator, komik digital, terjemahan.</li>
                <li>• Layanan VPN, cloud hosting, streaming device, dan gadget otaku.</li>
              </ul>
            </div>

            <div className="p-5 rounded-lg border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Aturan Ketat &amp; Konten yang Dilarang Keras</span>
              </div>
              <ul className="space-y-1.5 text-xs text-content-secondary leading-relaxed">
                <li>• <strong>DILARANG:</strong> Konten pornografi eksplisit / 18+ vulgar (Safe For Work only).</li>
                <li>• Materi iklan yang melanggar ketentuan akan ditolak atau dihentikan seketika.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Form & Contact Direct CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Form (7 cols) */}
          <div className="lg:col-span-7 rounded-lg border border-border-subtle bg-surface-card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-content-primary">
                  Formulir Reservasi Iklan
                </h3>
                <p className="text-xs text-content-secondary mt-1">
                  Slot Terpilih:{' '}
                  <span className="text-amber font-semibold font-mono">
                    {currentSlot.title} ({currentSlot.dimensions})
                  </span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-content-muted block">Total Estimasi</span>
                <span className="text-lg font-bold font-mono text-amber">
                  {formatIDR(activePrice)}
                </span>
              </div>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-content-primary">
                  Pengajuan Berhasil Dikirim!
                </h4>
                <p className="mt-2 text-sm text-content-secondary max-w-md mx-auto">
                  Tim sponsorship KageWire akan menghubungi Anda via kontak WhatsApp/Email dalam 1x24 jam untuk verifikasi materi banner dan instruksi penayangan.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-surface-secondary border border-border-subtle text-xs font-semibold text-content-primary hover:bg-surface-hover"
                >
                  Ajukan Slot Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-content-secondary mb-1">
                    Nama Anda / Nama Brand / Bisnis *
                  </label>
                  <input
                    type="text"
                    required
                    value={advertiserName}
                    onChange={(e) => setAdvertiserName(e.target.value)}
                    placeholder="Contoh: Toko Merchandise Wibu / Game Studio"
                    className="w-full px-3.5 py-2.5 rounded-md bg-surface-main border border-border-subtle text-sm text-content-primary placeholder-content-muted focus:border-amber focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-content-secondary mb-1">
                      No. WhatsApp / Telegram *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Contoh: 0812-xxxx-xxxx"
                      className="w-full px-3.5 py-2.5 rounded-md bg-surface-main border border-border-subtle text-sm text-content-primary placeholder-content-muted focus:border-amber focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-content-secondary mb-1">
                      Target Link / Website Promosi *
                    </label>
                    <input
                      type="url"
                      required
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://brandanda.com"
                      className="w-full px-3.5 py-2.5 rounded-md bg-surface-main border border-border-subtle text-sm text-content-primary placeholder-content-muted focus:border-amber focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-content-secondary mb-1">
                    Catatan Tambahan atau Tanggal Mulai Tayang
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Mulai tayang awal bulan depan, materi gambar format JPG/WebP siap."
                    className="w-full px-3.5 py-2.5 rounded-md bg-surface-main border border-border-subtle text-sm text-content-primary placeholder-content-muted focus:border-amber focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-amber text-background font-semibold text-sm hover:bg-amber-light transition-all shadow-md shadow-amber/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Permintaan Sewa</span>
                  </button>
                  <a
                    href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 text-sm font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat WhatsApp Cepat</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Guidelines & FAQ (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-lg border border-border-subtle bg-surface-card p-6">
              <h4 className="font-editorial text-lg font-bold text-content-primary mb-3">
                Ketentuan & Format Banner
              </h4>
              <ul className="space-y-2.5 text-xs text-content-secondary leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <span>Format file didukung: WebP, PNG, JPG, GIF animasi (maksimal 2MB).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <span>Iklan tidak boleh mengandung konten pornografi eksplisit / 18+ vulgar (Safe For Work only).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <span>Laporan performa berkala (impressions & clicks) disediakan tiap minggu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <span>Pembayaran resmi via Transfer Bank BCA / Mandiri / QRIS resmi.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border-subtle bg-surface-card p-6">
              <h4 className="font-editorial text-lg font-bold text-content-primary mb-2">
                Kontak Langsung Tim Sponsorship
              </h4>
              <p className="text-xs text-content-secondary mb-4 leading-relaxed">
                Butuh kesepakatan kerjasama custom, takeover homepage, atau sponsorship khusus? Hubungi tim kami langsung.
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:ads@kagewire.com"
                  className="flex items-center gap-2.5 p-2.5 rounded bg-surface-main border border-border-subtle text-xs text-content-primary hover:border-amber/40 transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber" />
                  <span className="font-mono">ads@kagewire.com</span>
                </a>
                <a
                  href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded bg-surface-main border border-border-subtle text-xs text-content-primary hover:border-amber/40 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono">+62 812-3456-7890 (WhatsApp Official)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
