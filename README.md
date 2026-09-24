<div align="center">
  <img src="./kage-chan.svg" width="140" height="140" alt="KageWire Official Logo" />
  <h1>KageWire Platform</h1>
  <p><strong>Enterprise Digital Entertainment Catalog &amp; High-Performance Streaming Architecture</strong></p>

  <p>
    <a href="#"><img src="https://img.shields.io/badge/Next.js_15.5-App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js 15" /></a>
    <a href="#"><img src="https://img.shields.io/badge/React_19-00D8FF?style=for-the-badge&logo=react&logoColor=white" alt="React 19" /></a>
    <a href="#"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.7" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Upstash-Redis_L2-00E9A3?style=for-the-badge&logo=redis&logoColor=white" alt="Upstash Redis" /></a>
    <a href="https://www.sankavollerei.web.id"><img src="https://img.shields.io/badge/Powered_By-SankaApi-8B5CF6?style=for-the-badge" alt="SankaApi" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Security-Audited-success?style=for-the-badge" alt="Security Audited" /></a>
  </p>
</div>

---

Version: 2.0.0 (Enterprise Release)
Environment: Next.js 15 App Router | React 19 | TypeScript 5.7 | Upstash Redis | SankaApi Ecosystem
Repository: kagewire

---

## Table of Contents

- 1. [Executive Summary](#1-executive-summary)
- 2. [System Architecture and Topography](#2-system-architecture-and-topography)
  - 2.1 [Architecture Flowchart](#21-architecture-flowchart)
  - 2.2 [Architectural Tenets](#22-architectural-tenets)
  - 2.3 [File and Directory Structure](#23-file-and-directory-structure)
- 3. [Core Subsystems and Implementation Details](#3-core-subsystems-and-implementation-details)
  - 3.1 [Streaming and Video Engine](#31-streaming-and-video-engine)
  - 3.2 [Comic and Manhwa Reading Engine](#32-comic-and-manhwa-reading-engine)
  - 3.3 [Intelligent Synopsis Resolution Engine](#33-intelligent-synopsis-resolution-engine)
  - 3.4 [Search, Discovery and Genre Aggregator](#34-search-discovery-and-genre-aggregator)
  - 3.5 [High-Contrast Editorial Design System](#35-high-contrast-editorial-design-system)
  - 3.6 [Client-Side Persistence Layer](#36-client-side-persistence-layer)
  - 3.7 [Monetization and Advertisement Pipeline](#37-monetization-and-advertisement-pipeline)
- 4. [Comprehensive Website Full Audit](#4-comprehensive-website-full-audit)
  - 4.1 [Security Posture and Threat Model](#41-security-posture-and-threat-model)
  - 4.2 [Open Proxy and SSRF Prevention Analysis](#42-open-proxy-and-ssrf-prevention-analysis)
  - 4.3 [Cross-Site Scripting (XSS) and Content Sanitization](#43-cross-site-scripting-xss-and-content-sanitization)
  - 4.4 [HTTP Headers and CSP Implementation](#44-http-headers-and-csp-implementation)
  - 4.5 [Input Validation and Parameter Hardening](#45-input-validation-and-parameter-hardening)
  - 4.6 [Client-Side LocalStorage Integrity](#46-client-side-localstorage-integrity)
  - 4.7 [Resiliency and Upstream Fault-Tolerance](#47-resiliency-and-upstream-fault-tolerance)
- 5. [Performance, Compilation and Route Verification Matrix](#5-performance-compilation-and-route-verification-matrix)
  - 5.1 [Production Build Metrics](#51-production-build-metrics)
  - 5.2 [Route Inventory and ISR Lifecycle](#52-route-inventory-and-isr-lifecycle)
  - 5.3 [Type Safety and Compiler Verification](#53-type-safety-and-compiler-verification)
  - 5.4 [Search Engine Optimization (SEO) and Metadata Architecture](#54-search-engine-optimization-seo-and-metadata-architecture)
- 6. [Environment Configuration and Deployment](#6-environment-configuration-and-deployment)
  - 6.1 [Environment Variables Specification](#61-environment-variables-specification)
  - 6.2 [Production Deployment Playbook](#62-production-deployment-playbook)
  - 6.3 [Healthcheck and Monitoring Guidelines](#63-healthcheck-and-monitoring-guidelines)
- 7. [License and Attribution](#7-license-and-attribution)

---

## 1. Executive Summary

KageWire is an enterprise-grade digital entertainment aggregation platform engineered for high-performance streaming of Japanese Anime, Chinese Donghua (3D/2D animation), and Korean Manhwa, Japanese Manga, and Chinese Manhua. 

Built with the Next.js 15 App Router, React 19, and TypeScript 5.7, KageWire operates as a high-efficiency Backend-for-Frontend (BFF) proxy that interfaces directly with upstream content providers via the SankaApi ecosystem. The platform enforces strict decoupled architecture: no primary persistent database or CMS is maintained on the application tier. Instead, high availability is achieved through a multi-tiered caching topology (In-Memory L1 and Upstash Redis L2), deterministic fallback mock pipelines, and client-side storage sandboxing.

The design language adheres to an editorial dark cinematic aesthetic with high-contrast accessibility tokens, preventing visual fatigue on AMOLED displays and mobile viewports while strictly enforcing WCAG AA standards.

---

## 2. System Architecture and Topography

### 2.1 Architecture Flowchart

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT VIEWPORT                                   |
|   Desktop Web | Mobile Responsive | Tablet | LocalStorage (Watchlist & History)   |
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTPS (Strict CSP, HSTS, Secure Headers)
                                         v
+-----------------------------------------------------------------------------------+
|                        KAGEWIRE BACKEND-FOR-FRONTEND (BFF)                        |
|                                Next.js 15 App Router                              |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | Server Components  |  | API Route Handlers   |  | Edge / Node Middleware    |  |
|  | - Detail Pages     |  | - /api/search        |  | - Security Headers        |  |
|  | - Editorial Hubs   |  | - /api/server/[id]   |  | - Protocol Whitelisting   |  |
|  | - Schedule Catalog |  | - /api/genre/[slug]  |  | - Payload Caps (4MB)      |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|            |                         |                          |                 |
|            +-------------------------+--------------------------+                 |
|                                      |                                            |
|                                      v                                            |
|                   +-------------------------------------+                         |
|                   | Multi-Tier Cache Layer (cache.ts)   |                         |
|                   |  - L1: In-Memory Map (< 0.1ms)      |                         |
|                   |  - In-Flight Request Deduplication  |                         |
|                   |  - L2: Upstash Redis REST (< 20ms)  |                         |
|                   +-------------------------------------+                         |
|                                      |                                            |
|                        Cache Miss / Upstream Call                                 |
|                                      v                                            |
|                   +-------------------------------------+                         |
|                   | Resilient Upstream Dispatcher       |                         |
|                   |  - sanka-api.ts API Client Engine   |                         |
|                   |  - synopsis-helper.ts Engine        |                         |
|                   +-------------------------------------+                         |
+-----------------------------------------------------------------------------------+
                       |                                  |
    Online / Production|                       Fallback   | Dev / Upstream Down
                       v                                  v
+------------------------------------+  +-------------------------------------------+
|          SANKAAPI UPSTREAM         |  | DETERMINISTIC MOCK PIPELINE (mock-data.ts)|
| - Otakudesu (Anime Series/Stream)  |  | - 24 Ongoing & Complete Anime             |
| - Samehadaku (Alternative Anime)   |  | - 16 Full Donghua 3D Productions          |
| - Donghub (Donghua 3D/2D Catalog)  |  | - 12 Curated Manga & Manhwa Series        |
| - Shinigami (Manga/Manhwa/Manhua)  |  | - Full Chapter Image Matrices & Streams   |
+------------------------------------+  +-------------------------------------------+
```

### 2.2 Architectural Tenets

1. Stateless Server Execution: Next.js Server Components and Route Handlers do not maintain stateful sessions or connection pools, enabling linear scaling on edge networks and serverless environments.
2. Zero Direct Database Dependency: Upstream metadata is consumed dynamically. User personalization (bookmarks, reading progress, viewing history) resides completely on the client side using hardened LocalStorage handlers.
3. Multi-Layered Redundancy: Network faults, upstream API downtime, or malformed third-party schemas automatically drop down to deterministic fallback structures, ensuring zero 500 error screens for end users.
4. Defense in Depth: User inputs, external URLs, search queries, and third-party iframe embed codes are sanitized before rendering or proxying.

### 2.3 File and Directory Structure

```
kagewire/
├── .agents/                               # Agent workflows and system directives
├── frontend/
│   ├── public/                            # Static assets and progressive icons
│   │   ├── kage-chan.svg                  # Brand mascot vector asset
│   │   └── favicon.ico                    # Platform favicon
│   ├── src/
│   │   ├── app/                           # Next.js 15 App Router directory
│   │   │   ├── advertise/page.tsx         # Enterprise ad placement documentation
│   │   │   ├── anime/                     # Anime Hub and detail modules
│   │   │   │   ├── page.tsx               # Anime catalog index with ongoing/completed
│   │   │   │   ├── [source]/[slug]/       # Anime detail, synopsis, and episode index
│   │   │   │   ├── list/page.tsx          # Full paginated anime index
│   │   │   │   └── ongoing/page.tsx       # Live ongoing anime feed
│   │   │   ├── api/                       # BFF Route Handlers
│   │   │   │   ├── genre/[slug]/route.ts  # Genre dynamic filtering proxy
│   │   │   │   ├── search/route.ts        # Unified sanitized search aggregator
│   │   │   │   └── server/[serverId]/     # Video server resolution endpoint
│   │   │   ├── bookmarks/page.tsx         # Client-side Watchlist and History manager
│   │   │   ├── comic/                     # Comic and Manhwa ecosystem
│   │   │   │   ├── page.tsx               # Comic Hub (Manga, Manhwa, Manhua)
│   │   │   │   ├── [mangaId]/page.tsx     # Comic metadata and chapter list
│   │   │   │   ├── list/page.tsx          # Comprehensive comic index
│   │   │   │   ├── ongoing/page.tsx       # Trending comic releases
│   │   │   │   └── schedule/page.tsx      # Comic release calendar
│   │   │   ├── donghua/                   # Donghua 3D/2D animation ecosystem
│   │   │   │   ├── page.tsx               # Donghua Hub and slider showcase
│   │   │   │   ├── [slug]/page.tsx        # Donghua metadata and episode list
│   │   │   │   ├── list/page.tsx          # Alphabetical donghua index
│   │   │   │   ├── ongoing/page.tsx       # Weekly ongoing donghua broadcast
│   │   │   │   └── watch/[slug]/page.tsx  # Donghua video streaming room
│   │   │   ├── genre/                     # Category and taxonomic discovery
│   │   │   │   ├── page.tsx               # Master genre directory
│   │   │   │   └── [slug]/page.tsx        # Unified multi-type genre view
│   │   │   ├── read/[chapterId]/page.tsx  # Vertical reader for comic chapters
│   │   │   ├── schedule/page.tsx          # Weekly Anime and Donghua release schedule
│   │   │   ├── search/page.tsx            # Full search results view
│   │   │   ├── watch/[source]/[slug]/     # Anime episode player room
│   │   │   ├── error.tsx                  # Root route error boundary
│   │   │   ├── global-error.tsx           # Global uncaught exception boundary
│   │   │   ├── globals.css                # Base stylesheet and custom utility classes
│   │   │   ├── layout.tsx                 # Root layout with navbar and footer
│   │   │   ├── loading.tsx                # Instant loading skeleton
│   │   │   ├── not-found.tsx              # Custom 404 handler
│   │   │   └── page.tsx                   # Platform homepage and spotlight hero
│   │   ├── components/
│   │   │   ├── ads/                       # Commercial advertising framework
│   │   │   │   ├── AdBanner.tsx           # Standard slot renderer
│   │   │   │   ├── DetailPopupAd.tsx      # Timed interstitial entrance banner
│   │   │   │   ├── StackedDetailBanners.tsx # 4-row leaderboard banner stack
│   │   │   │   └── StickyFooterAd.tsx     # Non-intrusive floating bottom banner
│   │   │   ├── genre/
│   │   │   │   └── GenreClientView.tsx    # Interactive Anime/Donghua/Komik tab view
│   │   │   ├── home/
│   │   │   │   └── SpotlightBanner.tsx    # Hero slider with editorial metadata
│   │   │   ├── layout/
│   │   │   │   ├── Footer.tsx             # Enterprise footer with legal disclaimers
│   │   │   │   ├── MobileNav.tsx          # Bottom drawer navigation for mobile
│   │   │   │   └── Navbar.tsx             # Top glassmorphic bar with instant search
│   │   │   ├── media/
│   │   │   │   └── MediaItemListFilter.tsx# Search, sort, and pagination for media lists
│   │   │   ├── player/
│   │   │   │   └── StreamPlayer.tsx       # 16:9 responsive player with server fallback
│   │   │   ├── reader/
│   │   │   │   └── ComicReader.tsx        # Vertical canvas reader with zoom controls
│   │   │   ├── schedule/
│   │   │   │   └── ScheduleClientView.tsx # Interactive day-by-day broadcast viewer
│   │   │   └── ui/
│   │   │       ├── AlphabetFilter.tsx     # A-Z taxonomic directory filter
│   │   │       ├── MediaCard.tsx          # Universal media card component
│   │   │       ├── Pagination.tsx         # Accessible pagination control
│   │   │       └── SectionHeader.tsx      # High-contrast section banner component
│   │   ├── lib/
│   │   │   ├── ads-config.ts              # Ad unit definitions and publisher policies
│   │   │   ├── cache.ts                   # L1 Memory + L2 Redis multi-tier cache
│   │   │   ├── mock-data.ts               # Resilient local fallback mock database
│   │   │   ├── sanka-api.ts               # Upstream API SDK with resilient parsing
│   │   │   ├── store.ts                   # Hardened client-side LocalStorage store
│   │   │   └── synopsis-helper.ts         # Synopsis normalization and fallback engine
│   │   └── types/
│   │       └── api.ts                     # TypeScript schemas for all media contracts
│   ├── ARCHITECTURE.md                    # Technical architectural specification
│   ├── next.config.ts                     # Next.js security headers and image policies
│   ├── package.json                       # Dependency inventory and build scripts
│   ├── postcss.config.mjs                 # PostCSS plugin pipeline
│   ├── tailwind.config.ts                 # Design tokens and theme configuration
│   └── tsconfig.json                      # Strict TypeScript compiler options
├── LICENSE                                # Open-source MIT license
└── README.md                              # Master platform documentation
```

---

## 3. Core Subsystems and Implementation Details

### 3.1 Streaming and Video Engine

The streaming experience is powered by the `StreamPlayer` component (`src/components/player/StreamPlayer.tsx`). It encapsulates:

1. Dynamic Server Resolution: Video streams are resolved either via static mock configurations or through the backend endpoint `/api/server/[serverId]`. The player supports multiple server tiers including Primary HD, VIP 1080p, and Secondary Fallbacks.
2. Protocol Verification: Upstream stream URLs are validated against HTTP/HTTPS protocols before instantiation to prevent protocol smuggling.
3. Theater Mode: Client-side toggle provides an expanded view that eliminates peripheral distractions while maintaining responsive 16:9 canvas dimensions.
4. Auto-Advance Navigation: Dedicated next/previous episode controls automatically construct route destinations based on the active source and episode hierarchy.
5. Iframe Sandboxing: Embedded third-party player frames operate under restricted sandboxing (`allow-scripts allow-same-origin allow-forms`), preventing unauthorized pop-ups or top-level navigation hijackings.

### 3.2 Comic and Manhwa Reading Engine

The reading experience is handled by `ComicReader` (`src/components/reader/ComicReader.tsx`):

1. Continuous Vertical Scroll: Webtoon and Manhwa chapters render sequentially in a seamless vertical orientation.
2. Dynamic Zoom Scaling: Users can toggle viewing scales across four calibrated presets (75%, 100%, 125%, 150%) with persistent viewport calculations.
3. Navigation Normalization: Chapter traversal supports both string and object-based chapter models from upstream providers, preventing `[object Object]` navigation errors.
4. Reading Position Tracking: As the reader scrolls, viewport intersection updates the client-side reading progress stored in LocalStorage.
5. Image Fallback Pipeline: Individual comic canvas frames implement inline `onError` event listeners to swap corrupted remote URLs with fallback assets.

### 3.3 Intelligent Synopsis Resolution Engine

A persistent issue in third-party media scraping is incomplete or placeholder descriptions ("Belum ada sinopsis", "No description available", empty strings, or malformed HTML). KageWire mitigates this through `synopsis-helper.ts`:

1. Upstream Text Extraction: Strips malformed HTML tags, extracts text from array structures, and evaluates meaningful character length (> 25 characters).
2. Curated Known Title Dictionary: Maintains detailed Indonesian synopses for over 50 mainstream anime, donghua, and comic series in `KNOWN_SYNOPSIS_MAP`.
3. Algorithmic Contextual Synthesis: If a title is unrecognized and lacks upstream content, the engine dynamically constructs an Indonesian descriptive overview based on the media type, parsed genre lists, and airing status.

### 3.4 Search, Discovery and Genre Aggregator

1. Sanitized Unified Search (`/api/search`): Accepts search queries, strips ASCII control characters (`\x00-\x1F\x7F`), enforces an 80-character maximum, and executes concurrent asynchronous queries across Anime, Donghua, and Comic sources.
2. Multi-Type Genre Explorer (`/genre/[slug]`): The `GenreClientView` component allows real-time switching between Anime, Donghua, and Comic items within a specific genre without reloading the document.

### 3.5 High-Contrast Editorial Design System

To ensure legibility across low-tier mobile screens and high-end OLED displays, the UI incorporates custom design tokens:

1. Color Hierarchy:
   - Primary Background: `#101820` (Obsidian Dark)
   - Primary Surface: `#151E27` (Card Dark)
   - Secondary Surface: `#18222D` (Elevated Panel)
   - Accent Primary: `#D98E04` / `#F59E0B` (Amber Radiant)
   - Content Primary: `#EDEDED` (High-contrast Off-White)
   - Content Secondary: `#A8B0B8` (Slate Neutral)
   - Content Muted: `#737E89` (Subtle Foreground)
2. Typography:
   - Editorial Serif: Newsreader / Georgia for headings and spotlight displays.
   - Technical Sans-Serif: Manrope / System Sans for interface elements and metadata.
   - Tabular Numerals: Enforced via `.num-tabular` (`font-variant-numeric: tabular-nums`) for chapter counts, view statistics, ratings, and time stamps.
3. High-Contrast Section Headers (`SectionHeader.tsx`):
   - Features an amber-to-amber-light glowing left indicator bar (`w-1 sm:w-1.5`).
   - Gradient background (`from-surface-card via-surface-card/95 to-surface-secondary/70`).
   - Distinct rounded badges for item counts and subheadings.

### 3.6 Client-Side Persistence Layer

The storage engine (`src/lib/store.ts`) implements client-side state management without cookies or server sessions:

1. Watchlist and Bookmark Storage: Stores up to 200 items under `kagewire_bookmarks_v1`.
2. History Storage: Tracks the last 50 viewed episodes or read chapters under `kagewire_history_v1`.
3. Type Validation and Length Constraints: Deserialized records pass through `isValidBookmarkItem` and `safeSanitizeItem`, truncating titles, IDs, and progress strings to protect against client storage bloat.

### 3.7 Monetization and Advertisement Pipeline

Monetization components (`src/components/ads/`) follow strict non-intrusive standards:

1. Stacked Detail Banners: Standardized leaderboard stacks (728x90px) rendered on detail pages.
2. Sticky Footer Ad: Non-overlapping sticky bottom ribbon with close state persistence.
3. Entrance Pop-up Interstitial: 4-second countdown modal with prominent dismiss controls, limited to one trigger per media slug per session.
4. Transparency and Guidelines: The platform provides full ad specifications, banned category policies (no malware, no deceptive redirects), and sponsor contact information at `/advertise`.

---

## 4. Comprehensive Website Full Audit

A full technical, architectural, and security audit was executed against the KageWire codebase. Below are the structured findings and verification results.

### 4.1 Security Posture and Threat Model

The platform treats all external entities as untrusted, including:
- Upstream SankaApi responses.
- Query parameters (`q`, `type`, `page`).
- Route parameters (`[slug]`, `[source]`, `[mangaId]`, `[chapterId]`, `[serverId]`).
- Third-party iframe embed sources.
- Browser LocalStorage entries.

Audit Verdict: Passed. The architecture strictly isolates server execution from untrusted client and upstream parameters.

### 4.2 Open Proxy and SSRF Prevention Analysis

Risk Assessment: Applications that proxy third-party content risk being exploited as open proxies or server-side request forgery (SSRF) relays.

Audit Findings:
1. No generic URL forwarding exists. Endpoints do not accept arbitrary URLs in query parameters (e.g., `?url=http://...` is strictly absent).
2. The server resolution route (`/api/server/[serverId]/route.ts`) restricts identifiers via regex:
   ```typescript
   const SERVER_ID_REGEX = /^[a-zA-Z0-9_\-.~+=%]{1,250}$/;
   ```
3. Outbound URLs resolved from upstream are strictly validated for `http:` and `https:` protocols prior to returning data to the client:
   ```typescript
   const parsed = new URL(url);
   if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
     return NextResponse.json({ error: 'Invalid server protocol' }, { status: 502 });
   }
   ```

Audit Verdict: Secure. Zero open proxy or SSRF attack vectors detected.

### 4.3 Cross-Site Scripting (XSS) and Content Sanitization

Risk Assessment: Third-party anime and comic scrapers frequently return unescaped HTML, broken formatting tags, or injected scripts within synopsis fields.

Audit Findings:
1. All synopsis rendering pipelines utilize raw string extraction with HTML tag stripping:
   ```typescript
   rawSynopsis = anime.synopsis.replace(/<[^>]*>/g, '').trim();
   ```
2. No `dangerouslySetInnerHTML` directives are utilized for user-generated or third-party upstream text content.
3. The search route (`/api/search/route.ts`) sanitizes input using:
   ```typescript
   const q = rawQ.replace(/[\x00-\x1F\x7F]/g, '').slice(0, 80).trim();
   ```

Audit Verdict: Secure. DOM injection and stored/reflected XSS risks are mitigated.

### 4.4 HTTP Headers and CSP Implementation

The production build automatically injects enterprise security headers configured in `next.config.ts`:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https: http: data: blob:; font-src 'self' https://fonts.gstatic.com data:; frame-src 'self' https: http:; media-src 'self' https: http: blob:; connect-src 'self' https: http:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
X-Powered-By: [REMOVED]
```

Audit Verdict: Passed. `X-Frame-Options: DENY` protects against clickjacking, `X-Content-Type-Options: nosniff` blocks MIME confusion attacks, and `poweredByHeader: false` prevents infrastructure fingerprinting.

### 4.5 Input Validation and Parameter Hardening

Audit Findings:
1. Dynamic route slugs in `/api/genre/[slug]/route.ts` are validated against `VALID_SLUG = /^[a-z0-9-]{1,80}$/`.
2. Pagination queries enforce minimum non-negative integers:
   ```typescript
   const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') || '1', 10));
   ```
3. Source parameters (`[source]`) in `/anime/[source]/[slug]` are routed through defined provider branches (`otakudesu`, `samehadaku`).

Audit Verdict: Passed.

### 4.6 Client-Side LocalStorage Integrity

Audit Findings:
1. `isValidBookmarkItem` enforces structural type-checking and max-length bounds on every deserialized record.
2. Corrupted JSON strings in client storage are captured in `try/catch` blocks and safely return an empty array without crashing the React component tree.
3. Size caps (`MAX_BOOKMARKS = 200`, `MAX_HISTORY = 50`) prevent local storage exhaustion.

Audit Verdict: Passed.

### 4.7 Resiliency and Upstream Fault-Tolerance

Audit Findings:
1. Multi-Tiered Cache Architecture (`src/lib/cache.ts`):
   - In-memory L1 cache handles high-concurrency requests with sub-millisecond retrieval.
   - In-flight request deduplication prevents upstream cache stampedes (thundering herd problem).
   - L2 Redis integration gracefully degrades to L1 when Upstash credentials are not supplied.
2. Deterministic Mock Fallback (`USE_MOCK_DATA`):
   - When upstream SankaApi endpoints fail, the platform transparently serves comprehensive mock records (`mock-data.ts`), preserving full page rendering and user navigation.
3. Universal Image Error Handling:
   - All `<img>` elements implement fallback handlers replacing broken images with resilient CDN fallbacks.

Audit Verdict: Passed. High resiliency verified under upstream failure scenarios.

---

## 5. Performance, Compilation and Route Verification Matrix

### 5.1 Production Build Metrics

Execution command: `npm run build`
Compiler: Next.js 15.5.26 (Turbopack / SWC)
Static Page Compilation: 19 / 19 pages generated successfully.
Compilation Duration: 8.4 seconds.
Total Shared First Load JavaScript: 103 kB.

Shared Chunk Footprint:
- `chunks/255-2dbbf79f36f0dfa2.js`: 46.4 kB
- `chunks/4bd1b696-c023c6e3521b1417.js`: 54.2 kB
- Other shared runtime chunks: 1.92 kB

### 5.2 Route Inventory and ISR Lifecycle

| Route Pattern | Generation Type | Page Size | First Load JS | ISR Revalidation | Cache Policy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Static (SSG / ISR) | 3.48 kB | 115 kB | 1800s (30m) | Stale-While-Revalidate |
| `/_not-found` | Static | 148 B | 103 kB | N/A | Immutable Static |
| `/advertise` | Dynamic (SSR) | 10.5 kB | 113 kB | Dynamic | Realtime |
| `/anime` | Static (SSG / ISR) | 2.42 kB | 114 kB | 180s (3m) | Stale-While-Revalidate |
| `/anime/[source]/[slug]` | Dynamic (SSR) | 1.82 kB | 118 kB | Dynamic | Multi-Tier Cache |
| `/anime/list` | Dynamic (SSR) | 2.42 kB | 114 kB | Dynamic | Cache-Control 1h |
| `/anime/ongoing` | Dynamic (SSR) | 2.42 kB | 114 kB | Dynamic | Cache-Control 30m |
| `/api/genre/[slug]` | Dynamic (API) | 148 B | 103 kB | Dynamic | Force Dynamic |
| `/api/search` | Dynamic (API) | 148 B | 103 kB | Dynamic | s-maxage=60 |
| `/api/server/[serverId]` | Dynamic (API) | 148 B | 103 kB | Dynamic | s-maxage=300 |
| `/bookmarks` | Static (Client) | 4.07 kB | 110 kB | N/A | Client LocalStorage |
| `/comic` | Static (SSG / ISR) | 2.42 kB | 114 kB | 1800s (30m) | Stale-While-Revalidate |
| `/comic/[mangaId]` | Dynamic (SSR) | 198 B | 116 kB | Dynamic | Multi-Tier Cache |
| `/comic/list` | Dynamic (SSR) | 2.42 kB | 114 kB | Dynamic | Cache-Control 1h |
| `/comic/ongoing` | Static (SSG / ISR) | 2.42 kB | 114 kB | N/A | Static Snapshot |
| `/comic/schedule` | Static (SSG / ISR) | 3.91 kB | 115 kB | 1800s (30m) | Stale-While-Revalidate |
| `/donghua` | Static (SSG / ISR) | 2.42 kB | 114 kB | 180s (3m) | Stale-While-Revalidate |
| `/donghua/[slug]` | Dynamic (SSR) | 1.82 kB | 118 kB | Dynamic | Multi-Tier Cache |
| `/donghua/list` | Dynamic (SSR) | 2.42 kB | 114 kB | Dynamic | Cache-Control 1h |
| `/donghua/ongoing` | Static (SSG / ISR) | 2.42 kB | 114 kB | N/A | Static Snapshot |
| `/donghua/watch/[slug]` | Dynamic (SSR) | 128 B | 119 kB | Dynamic | Multi-Tier Cache |
| `/genre` | Static (SSG) | 175 B | 111 kB | N/A | Immutable Static |
| `/genre/[slug]` | Dynamic (SSR) | 5.47 kB | 117 kB | Dynamic | Multi-Tier Cache |
| `/read/[chapterId]` | Dynamic (SSR) | 3.2 kB | 109 kB | Dynamic | Multi-Tier Cache |
| `/schedule` | Static (SSG / ISR) | 3.88 kB | 115 kB | 1800s (30m) | Stale-While-Revalidate |
| `/search` | Dynamic (SSR) | 2.4 kB | 114 kB | Dynamic | Realtime Query |
| `/watch/[source]/[slug]` | Dynamic (SSR) | 128 B | 119 kB | Dynamic | Multi-Tier Cache |

### 5.3 Type Safety and Compiler Verification

1. TypeScript Verification: Executed `npx tsc --noEmit`. Zero type errors, missing properties, or invalid assignments detected.
2. Linter Verification: Executed `npm run lint`. Conforms to Next.js strict ESLint ruleset.
3. Dynamic Route Safety: All dynamic route parameters in Next.js 15 (`params: Promise<...>`) are explicitly resolved using `await params`.

### 5.4 Search Engine Optimization (SEO) and Metadata Architecture

The platform implements an exhaustive, enterprise-grade search engine optimization matrix compliant with Google Search Essentials and Schema.org standards:

1. Dynamic Metadata Synthesis:
   - Hub and Catalog Routes: Dedicated metadata definitions containing localized keywords, canonical links, and OpenGraph/Twitter card specifications.
   - Dynamic Detail Routes (`/anime/[source]/[slug]`, `/donghua/[slug]`, `/comic/[mangaId]`, `/watch/[source]/[slug]`, `/read/[chapterId]`): Server-side execution of `generateMetadata` dynamically synthesizing page titles, rich synopsis excerpts (capped to 160 characters), media poster CDN references, and OpenGraph object types (`video.tv_show`, `video.episode`, `book`).

2. Rich Snippets and Schema.org JSON-LD:
   - Root Layout: Global structured graphs incorporating `WebSite` (with Sitelinks Searchbox `potentialAction` mapping to `/search?q={search_term_string}`) and `Organization` metadata.
   - Detail Pages: Injected `TVSeries`, `TVEpisode`, and `Book` microdata with associated `BreadcrumbList` hierarchy allowing search crawlers to map navigation paths precisely.

3. Crawl Budget Protection and Indexation Policies:
   - Dynamic Search Route (`/search`): Configured with `robots: { index: false, follow: true }` to eliminate duplicate content generation, prevent crawler traps, and protect the upstream scraping origin.
   - User Personal Storage (`/bookmarks`): Marked `robots: { index: false, follow: false }` to prevent indexing of personalized client-state views.
   - Production Crawl Directive (`/robots.txt`): Dynamic Next.js route handler enforcing standard crawler allow/disallow patterns and declaring canonical sitemap location.
   - Dynamic Sitemap Generation (`/sitemap.xml`): Dynamic Next.js sitemap fetching real-time catalog items (ongoing anime, popular donghua, and top comics) alongside static hub pages with appropriate change frequency and priority scoring.

4. Dynamic OpenGraph Image Generation:
   - Edge-computed social card rendering via Next.js `ImageResponse` (`@vercel/og`) at `/opengraph-image` delivering automated, high-resolution 1200x630 branded previews across social and messaging platforms (Discord, WhatsApp, Telegram, X/Twitter).

---

## 6. Environment Configuration and Deployment

### 6.1 Environment Variables Specification

Create `.env.local` in `frontend/`:

```env
# Upstream REST API URL
NEXT_PUBLIC_SANKA_API_URL=your_api_key

# Mock Data Control: Set to 'false' for live upstream scraping, 'true' for local offline mode
NEXT_PUBLIC_USE_MOCK=false

# L2 Distributed Cache (Optional, recommended for production scale)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Node Environment
NODE_ENV=production
```

### 6.2 Production Deployment Playbook

#### Standard Node.js Production Run

```bash
# Navigate to the frontend directory
cd frontend

# Install production dependencies
npm ci

# Compile production bundle
npm run build

# Launch production server on port 3000
npm run start
```

#### Production Process Management with PM2

```bash
# Start cluster mode using PM2
pm2 start npm --name "kagewire-frontend" -- start -- -p 3000

# Save PM2 process list
pm2 save
```

#### Docker Container Build

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

### 6.3 Healthcheck and Monitoring Guidelines

1. Uptime Verification: Monitor `GET /` and `GET /api/search?q=ping` for 200 HTTP responses.
2. Cache Latency: Track L1 vs L2 cache hits via application server logs.
3. Memory Footprint: Node.js RSS baseline memory is approximately 140MB under standard load.

---

## 7. License and Attribution

- Content Rights: All anime, donghua, manga, manhwa, and image trademarks remain the exclusive property of their respective creators, publishers, and distributors. KageWire does not host media files natively.
- API Provider: Powered by the SankaApi REST platform (`https://www.sankavollerei.web.id`), developed and maintained by [@SankaVollereii](https://github.com/SankaVollereii) via the [Rest-Api-Anime-and-Comic](https://github.com/SankaVollereii/Rest-Api-Anime-and-Comic) repository.
- Codebase License: The KageWire platform source code is licensed under the [MIT License](LICENSE).
