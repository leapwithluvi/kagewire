# KageWire Frontend Architecture (v2.0)

KageWire telah dirombak menjadi platform streaming Anime, Donghua, dan pembaca Manga/Manhwa kelas enterprise yang ditenagai oleh **SankaApi REST Platform**.

---

## 🏛️ Stack Teknologi

- **Framework**: Next.js 15+ (App Router)
- **Library**: React 19, TypeScript
- **Styling**: Tailwind CSS + Custom Obsidian Glassmorphism (`src/app/globals.css`)
- **Icons**: Lucide React
- **Data Source**: [SankaApi](https://www.sankavollerei.web.id) RESTful Anime & Comic Ecosystem
- **State Persistence**: LocalStorage Watchlist, Reading History, and Bookmarks (`src/lib/store.ts`)

---

## 📂 Struktur Direktori

```
frontend/
├── src/
│   ├── app/
│   │   ├── (Home)
│   │   │   ├── page.tsx               # Spotlight banner, ongoing anime, trending donghua, top manhwa
│   │   │   ├── layout.tsx             # Root Layout with Glassmorphic Navbar & Footer
│   │   │   ├── globals.css            # Custom CSS tokens & dark theme
│   │   │   ├── error.tsx              # Error boundary with retry
│   │   │   └── not-found.tsx          # Custom 404 page
│   │   ├── anime/
│   │   │   ├── page.tsx               # Anime Hub (Otakudesu ongoing/completed & Samehadaku)
│   │   │   └── [source]/[slug]/       # Detail anime, sinopsis, dan daftar episode
│   │   ├── watch/
│   │   │   └── [source]/[slug]/       # Room streaming anime, server selector & episode jump
│   │   ├── donghua/
│   │   │   ├── page.tsx               # Donghua Hub (Donghub 3D/2D series)
│   │   │   ├── [slug]/                # Detail serial donghua & episode
│   │   │   └── watch/[slug]/          # Room streaming donghua player
│   │   ├── comic/
│   │   │   ├── page.tsx               # Comic Hub (Manga, Manhwa, Manhua dari Shinigami)
│   │   │   └── [mangaId]/             # Detail komik & daftar chapter
│   │   ├── read/
│   │   │   └── [chapterId]/           # Distraction-free vertical webtoon reader
│   │   ├── search/
│   │   │   └── page.tsx               # Pencarian multi-kategori (Anime, Donghua, Manga)
│   │   └── bookmarks/
│   │       └── page.tsx               # Watchlist & Riwayat tontonan/bacaan lokal
│   ├── components/
│   │   ├── home/
│   │   │   └── SpotlightBanner.tsx    # Hero slider dengan animasi & rating
│   │   ├── layout/
│   │   │   ├── Navbar.tsx             # Sticky blur navigation & search bar
│   │   │   └── Footer.tsx             # Enterprise footer & credits
│   │   ├── player/
│   │   │   └── StreamPlayer.tsx       # 16:9 responsive player, server switch & theater mode
│   │   ├── reader/
│   │   │   └── ComicReader.tsx        # Vertical scroll reader, zoom & chapter controls
│   │   └── ui/
│   │       └── MediaCard.tsx          # Card media serbaguna dengan hover effect
│   ├── lib/
│   │   ├── sanka-api.ts               # Typed SDK untuk komunikasi dengan SankaApi
│   │   └── store.ts                   # Store manajemen watchlist & histori lokal
│   └── types/
│       └── api.ts                     # TypeScript kontrak untuk entitas anime, donghua & komik
├── next.config.ts                     # Konfigurasi remote domain gambar
├── tailwind.config.ts                 # Palette warna dark mode & neon accents
├── tsconfig.json                      # Path alias `@/*` -> `./src/*`
└── package.json
```

---

## 🚀 Menjalankan Aplikasi

```bash
# Masuk ke direktori frontend
cd frontend

# Jalankan mode pengembangan
npm run dev

# Build untuk produksi
npm run build

# Menjalankan server produksi
npm start
```
