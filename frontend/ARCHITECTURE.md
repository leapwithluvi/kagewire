# KageWire Frontend Architecture Specification (v2.0)

Document Version: 2.0.0 (Enterprise Architecture Release)  
Framework: Next.js 15.5.26 (App Router) | React 19 | TypeScript 5.7  
State & Storage: In-Memory LRU (L1) | Upstash Redis REST (L2) | LocalStorage (Client Persistence)  
Security Standard: CSP Strict | OWASP Top 10 Aligned | Content Isolation  
Design System: Obsidian Editorial Glassmorphism | Tailwind CSS | Tabular Typography  

---

## 1. Executive Architecture Overview

KageWire is an enterprise-grade digital entertainment aggregation and streaming web platform engineered specifically for high-speed delivery of Anime, Donghua (Chinese Animation), and Comic (Manga, Manhwa, Manhua) media.

The system utilizes an asynchronous Backend-for-Frontend (BFF) topology hosted entirely within Next.js Server Components and Route Handlers. The application operates as a decoupled presentation and caching layer on top of the SankaApi REST Platform, guaranteeing ultra-low Time to First Byte (TTFB), defensive upstream request deduplication, resilient fallback states, and complete search engine discoverability.

---

## 2. Technology Stack and Core Dependencies

| Tier | Technology | Specification / Implementation Rationale |
| :--- | :--- | :--- |
| **Framework Runtime** | Next.js 15.5.26 | App Router, Server Components (RSC), Incremental Static Regeneration (ISR), Edge Dynamic Og-Image. |
| **UI Library** | React 19.1.0 | Server and Client Components boundary isolation, Suspense streaming boundaries, useMemo/useCallback optimization. |
| **Language** | TypeScript 5.7 | End-to-end typed contracts (`@/types/api.ts`), compile-time static type analysis, zero `any` leaks on public interfaces. |
| **Styling & Design System** | Tailwind CSS 3.4 | Tailored HSL color variables, Glassmorphism backdrop-blur tokens, custom typography pairing (`Manrope` + `Newsreader`). |
| **Icons & Visuals** | Lucide React | Tree-shakeable SVG glyph set conforming to clean editorial ergonomics. |
| **L1 Cache Layer** | In-Memory LRU | Process-memory cache with Time-To-Live (TTL) timestamps protecting against burst concurrency. |
| **L2 Cache Layer** | Upstash Redis | HTTP REST-based serverless Redis layer enabling distributed cache sharing without persistent TCP connection pools. |
| **SEO & Microdata** | Schema.org JSON-LD | Server-rendered Rich Snippets (`WebSite`, `Organization`, `TVSeries`, `TVEpisode`, `Book`, `BreadcrumbList`). |
| **Client Storage** | Web Storage API | Isolated `localStorage` interface managing user bookmarks, watchlist, and episodic watch history. |

---

## 3. High-Level Architectural Topography and Data Flow

```
[ Client Browser / Mobile / Desktop ]
                |
                v  (HTTPS / TLS 1.3)
[ Cloudflare / CDN Edge Layer ]
                |
                v  (HTTP Security Headers + CSP Applied)
[ Next.js 15 App Router (BFF Layer) ]
        |                              |
        v (Server Component / ISR)     v (Client Component)
[ Data Retrieval Orchestrator ]   [ Browser LocalStorage ]
        |                         (Bookmarks / Watch History)
        +----------------------------------------+
        |                                        |
        v                                        v
[ L1 Cache: In-Memory LRU ]             [ Client State Manager ]
  - Hit: Return cached payload            (`src/lib/store.ts`)
  - Miss: Forward to L2
        |
        v
[ L2 Cache: Upstash Redis REST ]
  - Hit: Re-seed L1 & return payload
  - Miss: Forward to Upstream
        |
        v
[ Upstream Fetcher (sanka-api.ts) ]
  - Source Whitelist Check
  - Path Traversal Sanitization
  - Request Timeout (8000ms)
        |
        +------------------------+
        |                        |
        v (Success)              v (HTTP 429 Rate Limit / 5xx Offline)
[ SankaApi REST Platform ]     [ Deterministic Mock Data Fallback ]
  - Otakudesu Source             (`src/lib/mock-data.ts`)
  - Samehadaku Source
  - Donghub Source
  - Komikku Source
```

---

## 4. Multi-Tier Caching and Fault Tolerance Matrix

To mitigate the upstream SankaApi rate limit constraint (1,000 requests per hour per IP) and ensure zero service disruption during provider degradation, KageWire enforces a three-tier caching hierarchy:

### 4.1 Caching Tiers

1. **L1 In-Memory Cache**:
   - Resides directly within the Node.js runtime process memory.
   - Cache keys are generated deterministically: `kage:l1:{endpoint}:{params_hash}`.
   - Default TTL: 3 minutes for ongoing series, 30 minutes for catalog indexes, 60 minutes for chapter/episode static manifests.

2. **L2 Upstash Redis REST Cache**:
   - Stateless HTTP-based communication via Upstash REST API (`UPSTASH_REDIS_REST_URL`).
   - Automatically synchronizes across horizontal container instances or Vercel serverless function warm executions.
   - Prevents duplicate upstream network requests across concurrent visitor sessions.

3. **Incremental Static Regeneration (ISR)**:
   - Hub and schedule routes (`/`, `/anime`, `/comic`, `/donghua`, `/schedule`) declare explicit `revalidate` intervals.
   - Stale responses are served instantly from edge cache while background revalidations re-seed the cache without client latency penalties.

### 4.2 Upstream Fault-Tolerance and Fallback Protocol

```
API Request -> [L1 Cache Check]
                 | (Miss)
                 v
               [L2 Cache Check]
                 | (Miss)
                 v
               [SankaApi Upstream HTTP Call]
                 |
        +--------+--------+
        |                 |
     (200 OK)      (429 / 5xx / Timeout)
        |                 |
        v                 v
[Write L2 & L1]     [Inspect USE_MOCK / Fallback Flag]
        |                 |
        +--------+--------+
                 |
                 v
        [Render Server Component Payload]
```

When SankaApi responds with HTTP 429 (Too Many Requests), HTTP 502/503/504, or exceeds an 8000ms socket timeout, the fetcher triggers an automatic fallback to structured mock data (`src/lib/mock-data.ts`), ensuring uninterrupted reading and streaming user journeys.

---

## 5. Security Posture and Perimeter Hardening

### 5.1 Content Security Policy (CSP)

Configured within `frontend/next.config.ts`:

- `default-src 'self'`: Restricts unauthorized external resource fetching.
- `frame-ancestors 'none'`: Prevents clickjacking and unauthorized embedding in foreign iframes.
- `object-src 'none'`: Eliminates Flash/applet attack surfaces.
- `base-uri 'self'`: Prevents HTML `<base>` injection hijacking relative script tags.
- `form-action 'self'`: Restricts form submission targets to the current domain.
- `img-src 'self' https: http: data: blob:`: Whitelists dynamic remote comic CDN servers.
- `connect-src 'self' https: http:`: Permits secure stream extraction and Upstash REST communication.

### 5.2 HTTP Security Headers

- `X-Frame-Options: DENY`: Full protection against clickjacking.
- `X-Content-Type-Options: nosniff`: Enforces strict MIME sniffing protection.
- `Referrer-Policy: strict-origin-when-cross-origin`: Minimizes referrer leakage on external asset requests.
- `Permissions-Policy`: Restricts camera, microphone, geolocation, usb, and payment APIs to empty tuples (`=()`).
- `poweredByHeader: false`: Removes `X-Powered-By: Next.js` fingerprint header.

### 5.3 Input Sanitization and Route Parameter Hardening

Every dynamic parameter in Next.js 15 (`[source]`, `[slug]`, `[mangaId]`, `[chapterId]`) undergoes strict pre-validation prior to passing to API wrappers:

```typescript
// Strict parameter validation pattern applied across all dynamic routes
if (
  !slug ||
  slug.length > 150 ||
  slug.includes('/') ||
  slug.includes('..') ||
  slug.includes('%2e%2e')
) {
  notFound();
}

// Source allowlist validation
const ALLOWED_ANIME_SOURCES = ['otakudesu', 'samehadaku'];
if (!ALLOWED_ANIME_SOURCES.includes(source)) {
  notFound();
}
```

This completely closes potential path traversal, directory traversal, SSRF injection, and arbitrary endpoint querying vectors.

---

## 6. Search Engine Optimization (SEO) and Metadata Architecture

The platform incorporates an exhaustive SEO framework aligned with Google Search Essentials and Schema.org standards:

### 6.1 Metadata Generation Matrix

- **Root Layout (`src/app/layout.tsx`)**: Declares `metadataBase`, title template (`%s | KageWire`), comprehensive multilingual keywords, openGraph specifications, Twitter card configurations, and canonical URL anchors.
- **Dynamic Detail Pages**: Server-side `generateMetadata` dynamically synthesizes titles, normalized synopsis excerpts (capped to 160 characters), CDN poster paths, and media openGraph types (`video.tv_show`, `video.episode`, `book`).
- **Private and Filter Routes (`/search`, `/bookmarks`)**: Configured with `robots: { index: false, follow: true }` and `robots: { index: false, follow: false }` to avoid crawl traps, eliminate duplicate indexation, and preserve search engine crawl budgets.

### 6.2 Schema.org Rich Snippets (JSON-LD)

| Route Type | Primary Schema | Secondary Schema | Purpose |
| :--- | :--- | :--- | :--- |
| **Site Root (`/`)** | `WebSite` | `Organization` | Sitelinks Searchbox (`/search?q={search_term_string}`) and brand authority verification. |
| **Anime Detail (`/anime/*`)** | `TVSeries` | `BreadcrumbList` | Hierarchical SERP breadcrumbs and episodic metadata indexation. |
| **Donghua Detail (`/donghua/*`)** | `TVSeries` | `BreadcrumbList` | Donghua episodic series rich snippets. |
| **Comic Detail (`/comic/*`)** | `Book` / `ComicSeries` | `BreadcrumbList` | E-book and comic edition metadata with chapter count indexing. |
| **Watch Pages (`/watch/*`, `/donghua/watch/*`)** | `TVEpisode` | `BreadcrumbList` | Episode-level query matching in search engines. |
| **Reader Page (`/read/*`)** | `BreadcrumbList` | N/A | Chapter-level navigation hierarchy. |

### 6.3 Edge-Rendered Dynamic OpenGraph Social Previews

Located at `src/app/opengraph-image.tsx`:
- Rendered via Next.js `ImageResponse` (`@vercel/og`) running on the Edge Runtime.
- Emits high-resolution 1200x630 PNG branded preview cards featuring the KageWire editorial color scheme, dynamic brand badges, and typography.
- Automatically injected into all social crawlers (Twitter/X, WhatsApp, Discord, Telegram, Facebook, LinkedIn).

### 6.4 Dynamic Crawling Directives

- `src/app/robots.ts`: Serves `/robots.txt` declaring open crawling for content routes, disallowing raw API routes (`/api/`), and referencing the dynamic sitemap.
- `src/app/sitemap.ts`: Serves `/sitemap.xml` dynamically ingesting real-time ongoing anime, popular donghua, and top comic routes alongside static catalog hubs with appropriate priority (`0.8 - 1.0`) and change frequency (`daily`).

---

## 7. Intelligent Synopsis Resolution Engine

Upstream metadata providers frequently supply missing, truncated, or raw HTML synopsis fields. The intelligent synopsis engine (`src/lib/synopsis-helper.ts`) enforces clean editorial presentation:

1. **HTML Stripping & Truncation**: Removes raw `<p>`, `<span>`, and `<div>` tags while preserving paragraph spacing.
2. **Contextual Fallback Generation**: If upstream synopsis is null or blank, the engine analyzes genres (e.g. Action, Romance, Cultivation), media type (Anime vs. Donghua vs. Comic), and release status to generate a grammatical, high-context Indonesian editorial synopsis.
3. **Typography Sanitization**: Strips excessive whitespace, cleans encoding artifacts, and standardizes punctuation.

---

## 8. Monetization and Advertisement Pipeline

KageWire integrates an enterprise-grade commercial advertisement delivery pipeline (`src/components/ads/*` and `src/lib/ads-config.ts`):

- **Ad Slot Inventory**:
  - `AdBanner`: Standard responsive leaderboard slots (728x90 desktop, 320x50 mobile).
  - `StackedDetailBanners`: Multi-tier stacked ad rows strategically placed above media details.
  - `DetailPopupAd`: Timed interstitial entrance modal with client countdown timer and non-intrusive dismissal.
  - `StickyFooterAd`: Persistent bottom bar banner with dismiss capabilities.
- **Self-Service Sponsorship Portal (`/advertise`)**: Interactive package calculator, CPM/CTR performance metrics display, slot dimensional specifications, and WhatsApp/Email inquiry automation.
- **Ad Blocker Resilience**: Component wrappers include neutral fallback geometries to prevent layout shifts (CLS) when third-party ad blockers are enabled.

---

## 9. Comprehensive Directory & File Structure

```
frontend/
├── public/
│   └── kage-chan.svg                       # Official KageWire SVG mascot and favicon
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout, fonts, Navbar, Footer, Global JSON-LD
│   │   ├── page.tsx                        # Editorial Homepage with Spotlight Hero & Multi-Catalog
│   │   ├── globals.css                     # Custom design tokens, glassmorphism utilities, scrollbars
│   │   ├── error.tsx                       # Client-side Error Boundary with retry handler
│   │   ├── global-error.tsx                # Catch-all Root Error Boundary
│   │   ├── loading.tsx                     # Global skeleton loading state
│   │   ├── not-found.tsx                   # Editorial 404 Not Found presentation
│   │   ├── robots.ts                       # Dynamic /robots.txt route handler
│   │   ├── sitemap.ts                      # Dynamic /sitemap.xml route handler with upstream ingestion
│   │   ├── opengraph-image.tsx             # Edge runtime 1200x630 dynamic OpenGraph social preview
│   │   ├── advertise/
│   │   │   ├── layout.tsx                  # Dedicated metadata layout for /advertise
│   │   │   └── page.tsx                    # Advertising rates, packages, and sponsor booking portal
│   │   ├── anime/
│   │   │   ├── page.tsx                    # Anime Hub with Otakudesu & Samehadaku ongoing listings
│   │   │   ├── list/page.tsx               # A-Z Anime Directory with pagination & search
│   │   │   ├── ongoing/page.tsx            # Real-time ongoing anime schedule grid
│   │   │   └── [source]/[slug]/
│   │   │       └── page.tsx                # Anime detail, synopsis, episode list, JSON-LD TVSeries
│   │   ├── watch/
│   │   │   └── [source]/[slug]/
│   │   │       └── page.tsx                # Video streaming room, server switcher, JSON-LD TVEpisode
│   │   ├── comic/
│   │   │   ├── page.tsx                    # Comic Hub (Manga, Manhwa, Manhua)
│   │   │   ├── list/page.tsx               # A-Z Comic Directory with format filtering
│   │   │   ├── ongoing/page.tsx            # Latest updated comic chapters
│   │   │   ├── schedule/page.tsx           # Weekly comic release calendar
│   │   │   └── [mangaId]/
│   │   │       └── page.tsx                # Comic detail, chapter inventory, JSON-LD Book
│   │   ├── read/
│   │   │   └── [chapterId]/
│   │   │       └── page.tsx                # Fullscreen vertical reader with zoom, chapter navigation
│   │   ├── donghua/
│   │   │   ├── page.tsx                    # Donghua Hub (Chinese 3D/2D animation)
│   │   │   ├── list/page.tsx               # Complete donghua directory
│   │   │   ├── ongoing/page.tsx            # Ongoing donghua releases
│   │   │   ├── [slug]/page.tsx             # Donghua detail, JSON-LD TVSeries
│   │   │   └── watch/[slug]/page.tsx       # Donghua streaming room, server options, JSON-LD TVEpisode
│   │   ├── genre/
│   │   │   ├── page.tsx                    # Master taxonomy listing of all available genres
│   │   │   └── [slug]/page.tsx             # Dynamic genre filter results across media types
│   │   ├── schedule/
│   │   │   └── page.tsx                    # Integrated weekly broadcasting schedule for anime & donghua
│   │   ├── search/
│   │   │   └── page.tsx                    # Real-time unified search across Anime, Donghua, Comics
│   │   ├── bookmarks/
│   │   │   ├── layout.tsx                  # Noindex metadata layout for personal bookmarks
│   │   │   └── page.tsx                    # Client-side watchlist, reading history, and saved items
│   │   └── api/
│   │       ├── search/route.ts             # Lightweight edge search proxy
│   │       ├── genre/[slug]/route.ts       # Genre filter API handler
│   │       └── server/[serverId]/route.ts  # Resolved streaming embed extraction proxy
│   ├── components/
│   │   ├── ads/
│   │   │   ├── AdBanner.tsx                # Standard leaderboard ad banner
│   │   │   ├── StackedDetailBanners.tsx    # Multi-banner stacked leaderboard
│   │   │   ├── DetailPopupAd.tsx           # Timed interstitial detail modal
│   │   │   └── StickyFooterAd.tsx          # Floating bottom sticky banner
│   │   ├── home/
│   │   │   └── SpotlightBanner.tsx         # Hero featured carousel with backdrop crossfade
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                  # Sticky frosted navigation header with search
│   │   │   └── Footer.tsx                  # Enterprise corporate footer and attribution
│   │   ├── media/
│   │   │   └── MediaItemListFilter.tsx     # Client-side episode/chapter search and sorting filter
│   │   ├── player/
│   │   │   ├── StreamPlayer.tsx            # Video player container with iframe isolation & controls
│   │   │   ├── DownloadSection.tsx         # Direct resolution-based download links
│   │   │   └── StreamingNotice.tsx         # Video player disclaimer and upstream advisory
│   │   ├── reader/
│   │   │   └── ComicReader.tsx             # Continuous vertical webtoon reader with lazy loading
│   │   ├── schedule/
│   │   │   ├── ScheduleClientView.tsx      # Tabbed weekday selector for anime broadcasts
│   │   │   └── ComicScheduleClientView.tsx # Day-by-day release calendar for webtoons
│   │   └── ui/
│   │       ├── MediaCard.tsx               # Reusable card component with hover elevation & score badge
│   │       ├── SectionHeader.tsx           # Standardized editorial section typography header
│   │       └── TopProgressBar.tsx          # Smooth route change progress bar
│   ├── lib/
│   │   ├── sanka-api.ts                    # Enterprise REST client with L1/L2 caching & mock fallback
│   │   ├── mock-data.ts                    # Complete offline mock dataset for all media categories
│   │   ├── synopsis-helper.ts              # Natural language synopsis normalization engine
│   │   ├── ads-config.ts                   # Commercial pricing, inventory slots, and packages
│   │   ├── store.ts                        # Type-safe browser LocalStorage persistence manager
│   │   └── utils.ts                        # Class name merging and string manipulation helpers
│   └── types/
│       └── api.ts                          # Complete TypeScript interface contracts
├── .env.example                            # Production-ready environment variable blueprint
├── .env.local                              # Active local environment configuration (git-ignored)
├── next.config.ts                          # Next.js production configuration, CSP & image patterns
├── tailwind.config.ts                      # Tailwind CSS design system tokens
├── tsconfig.json                           # TypeScript compiler configuration with path aliases
└── package.json                            # Package dependencies and build script definitions
```

---

## 10. Operational Guidelines and Production Deployment

### 10.1 Environment Variables Configuration

Create `.env.local` prior to building:

```env
# Upstream REST Platform Base URL
NEXT_PUBLIC_SANKA_API_URL=https://www.sankavollerei.web.id

# Mock Mode Switch ('false' for live upstream scraping, 'true' for local zero-limit offline)
NEXT_PUBLIC_USE_MOCK=false

# Canonical Site Origin (Used for sitemap.xml, robots.txt, and metadataBase)
NEXT_PUBLIC_APP_URL=https://kagewire.vercel.app
NEXT_PUBLIC_APP_NAME=KageWire

# Upstash Redis REST Credentials (Required for distributed L2 cache)
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### 10.2 Production Verification Checklist

1. **Clean Production Compilation**:
   ```bash
   npm run build
   ```
   Must output `✓ Generating static pages (21/21)` with zero compiler errors and zero linting warnings.

2. **Type Check Verification**:
   ```bash
   npx tsc --noEmit
   ```
   Must exit with status `0`.

3. **Production Server Startup**:
   ```bash
   npm run start
   ```
   Verify that `/robots.txt`, `/sitemap.xml`, and `/opengraph-image` respond with HTTP 200 and correct Content-Type headers.
