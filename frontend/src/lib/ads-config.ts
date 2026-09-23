import { AdSlotConfig, AdBannerItem } from '@/types/api';

export const AD_PACKAGES: AdSlotConfig[] = [
  {
    slotId: 'home-billboard',
    format: 'billboard',
    title: 'Billboard Beranda Utama (Top)',
    location: 'Halaman Depan — Di bawah Hero Spotlight Utama',
    dimensions: '970 × 250 px',
    pricePerWeekIdr: 350000,
    pricePerMonthIdr: 1200000,
    isActive: false,
    description: 'Eksposur tertinggi di pintu masuk utama KageWire. Ideal untuk campaign peluncuran brand, gaming merchandise, atau layanan digital.',
  },
  {
    slotId: 'home-mid-strip',
    format: 'multi-strip',
    title: 'Multi-Sponsor Grid Strip (3 Banner)',
    location: 'Halaman Depan — Di antara Seksi Anime & Seksi Donghua',
    dimensions: '3 × (320 × 120 px)',
    pricePerWeekIdr: 300000,
    pricePerMonthIdr: 1000000,
    isActive: false,
    maxBanners: 3,
    description: 'Slot berdampingan untuk 3 mitra sponsor sekaligus. Format strip multi-brand dengan tingkat klik interaktif tinggi.',
  },
  {
    slotId: 'home-bottom-banner',
    format: 'billboard',
    title: 'Billboard Bawah Beranda (Footer Entrance)',
    location: 'Halaman Depan — Di atas Bagian Footer',
    dimensions: '970 × 250 px',
    pricePerWeekIdr: 250000,
    pricePerMonthIdr: 850000,
    isActive: false,
    description: 'Menangkap pengunjung yang telah selesai menjelajahi seluruh konten beranda dan siap menuju direktori lain.',
  },
  {
    slotId: 'anime-leaderboard',
    format: 'leaderboard',
    title: 'Leaderboard Header Anime',
    location: 'Katalog Anime & On-Going — Atas Grid Konten',
    dimensions: '728 × 90 px',
    pricePerWeekIdr: 200000,
    pricePerMonthIdr: 700000,
    isActive: false,
    description: 'Menargetkan puluhan ribu penikmat anime aktif setiap minggunya saat menjelajah katalog episode terbaru.',
  },
  {
    slotId: 'anime-mid-strip',
    format: 'multi-strip',
    title: 'Multi-Banner Strip Anime (2 Banner)',
    location: 'Katalog Anime — Di Tengah Grid Konten',
    dimensions: '2 × (468 × 90 px)',
    pricePerWeekIdr: 250000,
    pricePerMonthIdr: 800000,
    isActive: false,
    maxBanners: 2,
    description: 'Slot ganda simetris untuk mempromosikan 2 produk atau campaign berbeda di sela-sela daftar serial anime.',
  },
  {
    slotId: 'donghua-leaderboard',
    format: 'leaderboard',
    title: 'Leaderboard Header Donghua',
    location: 'Katalog Donghua & On-Going — Atas Grid Konten',
    dimensions: '728 × 90 px',
    pricePerWeekIdr: 175000,
    pricePerMonthIdr: 600000,
    isActive: false,
    description: 'Segmentasi spesifik untuk komunitas pecinta kultivasi 3D dan xianxia donghua.',
  },
  {
    slotId: 'donghua-mid-strip',
    format: 'multi-strip',
    title: 'Multi-Banner Strip Donghua (2 Banner)',
    location: 'Katalog Donghua — Di Tengah Grid Konten',
    dimensions: '2 × (468 × 90 px)',
    pricePerWeekIdr: 230000,
    pricePerMonthIdr: 780000,
    isActive: true,
    maxBanners: 2,
    description: 'Slot ganda premium untuk menjangkau komunitas donghua aktif di sela-sela konten serial.',
    banners: [
      {
        id: 'donghua-sponsor-1',
        title: 'Figure & Miniatur Donghua Karakter 3D',
        advertiserName: 'XianxiaStore',
        badge: 'Kolektor',
        description: 'Replika karakter Tang San, Wei Wuxian & Yun Che versi premium terbatas.',
        targetUrl: 'https://kagewire.com/advertise',
        isActive: true,
      },
      {
        id: 'donghua-sponsor-2',
        title: 'Belajar Mandarin Cepat Lewat Anime',
        advertiserName: 'HanyuClass Online',
        badge: 'Edukasi',
        description: 'Kursus bahasa Mandarin berbasis donghua dan drama, sertifikat HSK resmi.',
        targetUrl: 'https://kagewire.com/advertise',
        isActive: true,
      },
    ],
  },
  {
    slotId: 'comic-leaderboard',
    format: 'leaderboard',
    title: 'Leaderboard Header Komik',
    location: 'Katalog Komik & Manhwa — Atas Grid Konten',
    dimensions: '728 × 90 px',
    pricePerWeekIdr: 200000,
    pricePerMonthIdr: 700000,
    isActive: false,
    description: 'Menjangkau pembaca aktif webtoon/manhwa yang rutin menunggu update chapter mingguan.',
  },
  {
    slotId: 'comic-mid-strip',
    format: 'multi-strip',
    title: 'Multi-Banner Strip Komik (2 Banner)',
    location: 'Katalog Komik — Di Tengah Grid Konten',
    dimensions: '2 × (468 × 90 px)',
    pricePerWeekIdr: 240000,
    pricePerMonthIdr: 820000,
    isActive: true,
    maxBanners: 2,
    description: 'Slot ganda premium di sela daftar manhwa/manga terpopuler dengan pembaca sangat aktif.',
    banners: [
      {
        id: 'comic-sponsor-1',
        title: 'Beli Manhwa Original Harga Terjangkau',
        advertiserName: 'KomikShelf.id',
        badge: 'Buku & Komik',
        description: 'Manhwa cetak original Korea & Jepang, pengiriman ke seluruh Indonesia.',
        targetUrl: 'https://kagewire.com/advertise',
        isActive: true,
      },
      {
        id: 'comic-sponsor-2',
        title: 'Tablet Terbaik untuk Baca Webtoon',
        advertiserName: 'TechOtaku Store',
        badge: 'Gadget',
        description: 'Tablet 10 inci layar AMOLED khusus baca webtoon dan ebook manga kompatibel.',
        targetUrl: 'https://kagewire.com/advertise',
        isActive: true,
      },
    ],
  },
  {
    slotId: 'watch-player-top',
    format: 'leaderboard',
    title: 'Banner Atas Video Player',
    location: 'Halaman Nonton Streaming Anime & Donghua — Tepat di Atas Player',
    dimensions: '728 × 90 px',
    pricePerWeekIdr: 250000,
    pricePerMonthIdr: 900000,
    isActive: false,
    description: 'Tingkat pandang (viewability) maksimal saat audiens bersiap menonton episode baru.',
  },
  {
    slotId: 'watch-player-bottom',
    format: 'multi-strip',
    title: 'Banner Strip Bawah Video Player (2 Slot)',
    location: 'Halaman Nonton Streaming — Di Bawah Player & Pilihan Server',
    dimensions: '2 × (468 × 90 px)',
    pricePerWeekIdr: 220000,
    pricePerMonthIdr: 750000,
    isActive: false,
    maxBanners: 2,
    description: 'Terlihat jelas saat audiens menggulir untuk membaca info episode atau memilih server alternatif.',
  },
  {
    slotId: 'search-sidebar',
    format: 'rectangle',
    title: 'Medium Rectangle Pencarian',
    location: 'Halaman Cari & Hasil Penelusuran',
    dimensions: '300 × 250 px',
    pricePerWeekIdr: 150000,
    pricePerMonthIdr: 500000,
    isActive: false,
    description: 'Ukuran fleksibel dengan rasio klik tinggi (CTR) pada audiens berkeinginan cari konten spesifik.',
  },
  {
    slotId: 'sticky-footer',
    format: 'sticky-footer',
    title: 'Sticky Floating Bar Sitewide (Bawah Layar)',
    location: 'Melayang di Bagian Bawah Layar Seluruh Halaman (Follows Scroll)',
    dimensions: '728 × 90 px / Mobile 320 × 50 px',
    pricePerWeekIdr: 450000,
    pricePerMonthIdr: 1500000,
    isActive: true,
    description: 'Format dengan impresi 100% konsisten melayang di bagian bawah layar pengunjung dengan tombol tutup (dismissible).',
  },
  {
    slotId: 'sticky-top',
    format: 'sticky-top',
    title: 'Sticky Floating Bar Sitewide (Atas Layar)',
    location: 'Melayang di Atas Layar di Bawah Navigasi Seluruh Halaman (Follows Scroll)',
    dimensions: '728 × 90 px / Mobile 320 × 50 px',
    pricePerWeekIdr: 400000,
    pricePerMonthIdr: 1400000,
    isActive: true,
    description: 'Banner melayang di bagian atas layar pengunjung saat membaca atau menggulir konten, dilengkapi tombol dismiss.',
  },
  {
    slotId: 'popup-ad',
    format: 'popup',
    title: 'Pop-up Interstitial Modal Sitewide',
    location: 'Pop-up Modal Tengah Layar saat Mengunjungi Situs (Delay 4 Detik)',
    dimensions: '600 × 400 px / Mobile 320 × 350 px',
    pricePerWeekIdr: 650000,
    pricePerMonthIdr: 2200000,
    isActive: true,
    description: 'Format interaktif eksklusif dengan konversi dan CTR tertinggi. Muncul di tengah layar dengan hitungan mundur dan tombol tutup.',
  },
  {
    slotId: 'detail-sidebar-rect',
    format: 'rectangle',
    title: 'Medium Rectangle Sidebar Halaman Detail',
    location: 'Sidebar Halaman Detail Anime, Donghua & Komik (Di Bawah Poster)',
    dimensions: '300 × 250 px',
    pricePerWeekIdr: 180000,
    pricePerMonthIdr: 600000,
    isActive: true,
    description: 'Terletak strategis di sidebar halaman sinopsis serial, tepat di bawah poster dan tombol mulai streaming/membaca.',
  },
  {
    slotId: 'detail-bottom-banner',
    format: 'leaderboard',
    title: 'Leaderboard Bawah Halaman Detail',
    location: 'Bagian Bawah Halaman Detail Sebelum Daftar Rekomendasi',
    dimensions: '728 × 90 px',
    pricePerWeekIdr: 180000,
    pricePerMonthIdr: 600000,
    isActive: true,
    description: 'Menangkap audiens yang telah selesai menyimak episode/chapter dan mencari rekomendasi serial berikutnya.',
  },
  {
    slotId: 'detail-stacked',
    format: 'multi-strip',
    title: 'Slot Iklan Baris Bertumpuk (4 Multi-Banner Stack)',
    location: 'Bagian Paling Atas Halaman Sinopsis Detail Anime, Donghua & Komik',
    dimensions: '4 × (728 × 60 px) Responsive',
    pricePerWeekIdr: 350000,
    pricePerMonthIdr: 1200000,
    isActive: true,
    description: 'Format 4 banner horizontal bertumpuk seperti situs streaming anime klasik. Visibilitas 100% pertama kali halaman dibuka.',
  },
];

// Combo / Multiple Banner Discount Packages for Advertisers
export interface ComboPackage {
  id: string;
  name: string;
  badge: string;
  slotsIncluded: string[];
  description: string;
  pricePerWeekIdr: number;
  pricePerMonthIdr: number;
  savingsPercentage: number;
}

export const COMBO_PACKAGES: ComboPackage[] = [
  {
    id: 'combo-starter',
    name: 'Paket Duet Populer',
    badge: 'Hemat 20%',
    slotsIncluded: ['home-billboard', 'watch-player-top'],
    description: 'Kombinasi Billboard Beranda Utama dan Banner Atas Player Video untuk eksposur brand maksimal.',
    pricePerWeekIdr: 480000,
    pricePerMonthIdr: 1680000,
    savingsPercentage: 20,
  },
  {
    id: 'combo-multistrip',
    name: 'Paket Multi-Sponsor Dominasi',
    badge: 'Paling Populer',
    slotsIncluded: ['home-mid-strip', 'anime-leaderboard', 'comic-leaderboard'],
    description: 'Tampil di strip beranda plus header kategori Anime dan Komik sekaligus.',
    pricePerWeekIdr: 560000,
    pricePerMonthIdr: 1920000,
    savingsPercentage: 25,
  },
  {
    id: 'combo-takeover',
    name: 'Paket Sitewide Takeover (Semua Halaman)',
    badge: 'Brand Takeover',
    slotsIncluded: ['home-billboard', 'watch-player-top', 'anime-leaderboard', 'donghua-leaderboard', 'sticky-footer'],
    description: 'Dominasi seluruh jaringan KageWire dengan 5 slot banner aktif di beranda, katalog, dan pemutar video.',
    pricePerWeekIdr: 1100000,
    pricePerMonthIdr: 3900000,
    savingsPercentage: 35,
  },
  {
    id: 'combo-vip-ultimate',
    name: 'Paket VIP Sultan (Termasuk Pop-up & Sticky)',
    badge: 'Maksimal CTR',
    slotsIncluded: ['popup-ad', 'sticky-top', 'sticky-footer', 'home-billboard'],
    description: 'Paket terlengkap dengan pop-up interstitial, banner melayang atas & bawah, serta billboard utama untuk kampanye berskala masif.',
    pricePerWeekIdr: 1500000,
    pricePerMonthIdr: 5200000,
    savingsPercentage: 40,
  },
];

export interface BannerSpec {
  formatName: string;
  dimensions: string;
  mobileDimensions: string;
  fileFormats: string;
  maxFileSize: string;
  recommendedAspect: string;
  notes: string;
}

export const BANNER_SPECIFICATIONS: BannerSpec[] = [
  {
    formatName: 'Billboard Beranda (Top / Bottom)',
    dimensions: '970 × 250 px',
    mobileDimensions: '320 × 100 px',
    fileFormats: 'JPG, PNG, WebP, GIF Animasi',
    maxFileSize: '1.5 MB',
    recommendedAspect: '3.88 : 1 (Desktop) / 3.2 : 1 (Mobile)',
    notes: 'Loop GIF maks. 15 detik. Teks utama sebaiknya berada di area tengah agar tidak terpotong pada resolusi tablet.',
  },
  {
    formatName: 'Leaderboard Header (Anime / Donghua / Komik)',
    dimensions: '728 × 90 px',
    mobileDimensions: '320 × 50 px',
    fileFormats: 'JPG, PNG, WebP, GIF Animasi',
    maxFileSize: '1.0 MB',
    recommendedAspect: '8.09 : 1 (Desktop) / 6.4 : 1 (Mobile)',
    notes: 'Posisi prime di atas feed katalog. Gunakan warna kontras tinggi agar menarik perhatian pengguna.',
  },
  {
    formatName: 'Multi-Sponsor Grid Strip',
    dimensions: '320 × 120 px / 468 × 90 px',
    mobileDimensions: '300 × 100 px',
    fileFormats: 'JPG, PNG, WebP, GIF Animasi',
    maxFileSize: '800 KB',
    recommendedAspect: '2.67 : 1 atau 5.2 : 1',
    notes: 'Slot kotak strip berdampingan. Sangat efektif untuk promo voucher, produk merchandise, dan layanan berlangganan.',
  },
  {
    formatName: 'Medium Rectangle Sidebar',
    dimensions: '300 × 250 px',
    mobileDimensions: '300 × 250 px',
    fileFormats: 'JPG, PNG, WebP, GIF Animasi',
    maxFileSize: '1.0 MB',
    recommendedAspect: '1.2 : 1 (Standard IAB Rectangle)',
    notes: 'Tampil di sidebar halaman detail serial tepat di bawah aksi tonton. Rasio klik (CTR) organik sangat tinggi.',
  },
  {
    formatName: 'Sticky Floating Bar (Atas & Bawah Layar)',
    dimensions: '728 × 90 px (Desktop)',
    mobileDimensions: '320 × 50 px (Mobile)',
    fileFormats: 'JPG, PNG, WebP, GIF Animasi',
    maxFileSize: '600 KB',
    recommendedAspect: 'Rasio horizontal ramping',
    notes: 'Mengikuti pengguna saat menggulir halaman (sticky). Menyediakan tombol tutup (close/dismiss).',
  },
  {
    formatName: 'Pop-up Interstitial Modal',
    dimensions: '600 × 400 px',
    mobileDimensions: '320 × 350 px',
    fileFormats: 'JPG, PNG, WebP, GIF Animasi',
    maxFileSize: '1.2 MB',
    recommendedAspect: '3 : 2 (Desktop) / 1 : 1 (Mobile)',
    notes: 'Muncul di tengah layar setelah 4 detik kunjungan. Dilengkapi countdown 5 detik dan tombol tutup instan.',
  },
  {
    formatName: 'Multi-Banner Bertumpuk (Detail Stack 4 Baris)',
    dimensions: '728 × 60 px (per banner baris)',
    mobileDimensions: '320 × 50 px (per banner baris)',
    fileFormats: 'JPG, PNG, WebP, GIF Animasi',
    maxFileSize: '500 KB per baris',
    recommendedAspect: '12 : 1 (Ultra wide horizontal strip)',
    notes: '4 baris banner yang ditumpuk langsung di bagian paling atas halaman sinopsis anime, donghua, dan komik. Gaya klasik streaming anime.',
  },
];

export interface PurchaseStep {
  step: number;
  title: string;
  description: string;
  badge: string;
}

export const PURCHASE_STEPS: PurchaseStep[] = [
  {
    step: 1,
    title: 'Pilih Format Slot & Durasi',
    description: 'Tentukan posisi banner yang sesuai target audiens Anda (Billboard, Strip, Leaderboard, Sidebar, Sticky, atau Pop-up) dan pilih durasi sewa (1 Minggu atau 1 Bulan hemat 15%).',
    badge: 'Langkah 1',
  },
  {
    step: 2,
    title: 'Siapkan Materi Gambar / GIF & Link',
    description: 'Pastikan file banner Anda berformat JPG, PNG, WebP, atau GIF animasi sesuai ukuran piksel yang ditentukan. Sertakan tautan target (website, toko online, atau media sosial Anda).',
    badge: 'Langkah 2',
  },
  {
    step: 3,
    title: 'Hubungi Tim KageWire / Isi Form',
    description: 'Kirimkan data reservasi melalui formulir di halaman ini atau langsung kontak WhatsApp / Telegram resmi kami untuk konfirmasi ketersediaan jadwal slot.',
    badge: 'Langkah 3',
  },
  {
    step: 4,
    title: 'Pembayaran Mudah & Terverifikasi',
    description: 'Lakukan pembayaran menggunakan QRIS (semua e-wallet / mobile banking) atau Transfer Bank BCA / Mandiri. Invoice resmi akan langsung diterbitkan.',
    badge: 'Langkah 4',
  },
  {
    step: 5,
    title: 'Iklan Tayang 1×24 Jam + Laporan CTR',
    description: 'Banner Anda akan langsung live di seluruh jaringan KageWire. Anda akan menerima laporan performa berkala mencakup jumlah tayangan (impressions) dan klik.',
    badge: 'Langkah 5',
  },
];

export function getAdSlot(slotId: string): AdSlotConfig | undefined {
  return AD_PACKAGES.find((slot) => slot.slotId === slotId);
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
