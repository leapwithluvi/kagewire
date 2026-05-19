<div align="center">
  <a href="https://github.com/leapwithluvi/kagewire">
    <img width="1500" alt="KageWire Chronicles Banner" src="frontend/public/kagewire-banner.png" />
  </a>
</div>

<br/>
<br/>

<div align="center">
  <img width="140" height="140" alt="Kage-chan Mascot" src="frontend/public/kage-chan.svg" />
  <br />
  <sub>Meet <b>Kage-chan</b>, the official cozy forest mascot of KageWire Chronicles!</sub>
  <br />
  <br />
  <strong>Premium, high-performance fullstack anime news &amp; discovery platform restored with Studio Ghibli watercolor nostalgia.</strong>
  <br />
  <br />
</div>

<div align="center">
  <a href="https://github.com/leapwithluvi"><img src="https://custom-icon-badges.demolab.com/badge/made%20by%20-leapwithluvi-556bf2?logo=github&logoColor=white&labelColor=101827" alt="leapwithluvi" /></a>
  <a href="https://github.com/leapwithluvi/kagewire/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?color=dddddd&labelColor=000000" alt="License" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/github/languages/top/leapwithluvi/kagewire?logo=github&logoColor=%23007ACC&label=TypeScript" alt="Top Language" /></a>
  <a href="https://github.com/leapwithluvi/kagewire/commits/main"><img src="https://img.shields.io/github/last-commit/leapwithluvi/kagewire?logo=git&logoColor=white&color=3fa9e5&labelColor=101827&label=Last%20Update" alt="Last Commit" /></a>
  <a href="https://github.com/leapwithluvi/kagewire/stargazers"><img src="https://img.shields.io/github/stars/leapwithluvi/kagewire?logo=github&logoColor=white&color=ffb800&labelColor=101827&label=Stars" alt="Stars" /></a>
  <a href="https://github.com/leapwithluvi/kagewire/network/members"><img src="https://img.shields.io/github/forks/leapwithluvi/kagewire?logo=github&logoColor=white&color=00bfff&labelColor=101827&label=Forks" alt="Forks" /></a>
  <img src="https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=shields" alt="PRs" />
  <img src="https://img.shields.io/badge/Status-Active-success" alt="Status" />
</div>

# KageWire Chronicles

KageWire Chronicles is a premium, high-performance, and developer-grade fullstack anime news and discovery platform. Designed to deliver an immersive, cinematic, and ad-free experience, KageWire Chronicles combines aggressive server-side performance engineering with a nostalgic, hand-painted Studio Ghibli watercolor interface.

The platform resolves the visual congestion and bloated loading times common to traditional anime resources. By integrating a modular Express.js backend, strict Prisma ORM modeling on PostgreSQL, aggressive Redis caching policies, and a Next.js App Router frontend utilizing the brand new Tailwind CSS v4 engine, KageWire serves as both an elite media catalog and a showcase of production-ready web engineering.


## What is KageWire Chronicles?

KageWire Chronicles is a decoupled fullstack web ecosystem designed to deliver high-density media cataloging and automated discovery. 

It divides architectural concerns cleanly between isolated workspaces to preserve rendering speed on the client and transaction integrity on the server.

| Workspace / Layer | Core Technologies | Primary Role & Responsibility |
|---|---|---|
| `/frontend` | Next.js 15, Tailwind v4, React | Watercolor catalog interface, public discovery & reader layout |
| `/backend` | Express.js, TypeScript, REST | Unidirectional REST API, Swagger/OpenAPI interactive routing |
| `Prisma ORM` | PostgreSQL, schema.prisma | Relational database schema, migrations & transaction validation |


## Technologies Used

<details><summary>Built with a cutting-edge high-performance stack:</summary>
<br />

| Technology | Category | Primary Role & Responsibility |
| :--- | :--- | :--- |
| [Next.js 15](https://nextjs.org/) | Frontend | Client React application framework with App Router & server rendering |
| [React 19](https://react.dev/) | Frontend | UI rendering core with modern asynchronous state and component hydration |
| [Tailwind CSS 4](https://tailwindcss.com/) | Frontend | Utility-first styling engine compiled at build-time for zero runtime lag |
| [Framer Motion](https://www.framer.com/motion/) | Frontend | Fluid, hardware-accelerated animations for watercolor card interactive flows |
| [Express.js](https://expressjs.com/) | Backend | High-performance HTTP REST API gateway routing server |
| [TypeScript](https://www.typescriptlang.org/) | Core | Strict, type-safe development across frontend & backend workspaces |
| [Prisma ORM](https://www.prisma.io/) | Database | Type-safe database client for PostgreSQL modeling & transactional queries |
| [PostgreSQL 16](https://www.postgresql.org/) | Database | Relational storage engine for persistent user account schemas & catalogs |
| [Redis](https://redis.io/) | Database | Secondary memory-caching database to prevent API rate-limiting |

</details><br/>

[![Technologies Used](https://skillicons.dev/icons?i=nextjs,react,express,ts,tailwind,prisma,postgres,redis,nodejs,docker)](https://skillicons.dev)


## Cozy Ghibli Design System

KageWire rejects sterile digital dark voids and clinical lines. Instead, its UI/UX draws inspiration from the hand-drawn backgrounds of legendary director Hayao Miyazaki. The interface behaves like a warm, tactile watercolor journal.

- **Organic Textures** - Main views leverage a warm, soft Antique Cream canvas (`#fdfbf7`), mimicking physical watercolor sketching paper to reduce eye strain.
- **Tactile Borders** - Cards, form structures, and panels sit on slightly darker Weathered Parchment backgrounds (`#f3eee3`), cleanly enclosed by hand-drawn Oak Wood / Clay borders (`#cfa375`).
- **Soft Layer Shadows** - Avoid hard digital shadow drops. Only utilize ultra-light, amber-infused natural shadows (`shadow-amber-900/2`) to simulate the ambient depth of parchment paper layers.
- **Cozy Animations** - Micro-interactions utilize custom leaf-sprouting animations. On hover, primary sky blue buttons transition to a lush, soft grass green.


## System Architecture & Technical Specifications

<details>
<summary><b>System Topology & Decoupled Layers</b></summary>
<br />

The platform isolates data retrieval from UI rendering layers to maintain 100ms FCP targets.

```mermaid
flowchart LR
    subgraph Frontend [Frontend Workspace]
        Client["Next.js Client App"]
    end

    subgraph Backend [Backend Workspace]
        Server["Express.js API Gateway"]
        Redis[("Redis Cache")]
    end

    subgraph Data [Data & Services]
        PostgreSQL[("PostgreSQL Database")]
        AniList["AniList GraphQL API"]
        Jikan["Jikan REST API"]
        ANN["ANN RSS News Feed"]
    end

    Client -->|HTTPS REST| Server
    Server <-->|15-Min Cache| Redis
    Server -->|Prisma Relational| PostgreSQL
    Server -->|GraphQL Queries| AniList
    Server -->|REST Fallback| Jikan
    Server -->|XML/RSS Scrape| ANN
```

### Frontend Layout Layer
The client-side uses Next.js to provide a fast initial render via Server Components (RSC) and hydrated Client Components for interactive forms.
- **Modular Component Isolation**: Route controllers in `app/(public)/auth` are empty containers that import stateful page engines from `@/app/(public)/_components`. This separation preserves routing purity.
- **Dynamic Hydration**: Static showcase layouts are pre-rendered on the server, while forms dynamically hydrate with custom, highly interactive states on the client.
- **Strict Tailwind v4 Compilation**: Completely eliminates compiled utility runtime overhead. Every custom theme color, border radius scale, and font family operates on CSS Custom Properties injected at build-time.

### Backend Layered Service Layer
The Express backend is engineered to support unidirectional data flow through isolated layers:
1. **Routing Gateways**: Route endpoints that define strict URI patterns and mount validation/authentication middleware.
2. **Controller Layer**: Decodes raw HTTP requests, enforces schema validations, calls target services, and formats standard JSON envelopes.
3. **Service Layer**: Houses pure business logic. Communicates with ORM repositories, performs rate-limited external REST/GraphQL API requests, and formats outgoing DTOs.
4. **Data Repository Layer**: Utilizes Prisma client instances to interact with PostgreSQL, executing transaction flows and complex relational models.

</details>

<details>
<summary><b>Multi-Provider API Gateway & Fallbacks</b></summary>
<br />

To ensure unmatched data reliability and richer details, KageWire is designed to integrate a dynamic, multi-provider anime service gateway:

```mermaid
sequenceDiagram
    autonumber
    actor C as KageWire API Gateway
    participant J as Jikan REST Service
    participant A as AniList GraphQL Service
    participant ANN as ANN Scraper

    rect rgb(243, 238, 227)
        note right of C: 1. Try AniList GraphQL (Fast & Rich Metadata)
        C->{c}A: POST graphql query
        alt AniList Success (200 OK)
            A-->>C: Rich Anime Metadata + Ratings
        else AniList Failure / Rate Limit (429/500)
            note right of C: 2. Symmetrical Fallback to Jikan API
            C->{c}J: GET /v4/anime/{id}
            J-->>C: REST Anime Metadata
        end
    end

    rect rgb(253, 251, 247)
        note right of C: 3. Background Scrape for Anime News
        C->{c}ANN: GET RSS/XML Feeds
        ANN-->>C: Breaking Anime News Stream
    end
```

</details>

<details>
<summary><b>Workspace Folder Structure</b></summary>
<br />

The actual workspace organization model implemented on disk:

```text
frontend/
├── .agents/                        # Autonomous agent memory & visual templates
│   └── DESIGN.md                   # Custom Studio Ghibli Design Guidelines & tokens
├── app/                            # Next.js App Router Root
│   ├── (public)/                   # Segmented views accessible without authentication
│   │   ├── _components/            # STATEFUL PAGE ENGINES (Highly detailed Ghibli layouts)
│   │   │   ├── loginPage.tsx       # Watercolor Ghibli Login Panel
│   │   │   └── registerPage.tsx    # Watercolor Ghibli Registration Panel
│   │   ├── anime/                  # Anime Catalog search and details routing
│   │   │   ├── [id]/               # Dynamic Anime detailed view route container
│   │   │   └── search/             # Anime discovery search engine container
│   │   └── auth/                   # Route directories mapping public endpoints
│   │       ├── login/              # Endpoint container for /auth/login
│   │       │   └── page.tsx        # Dynamic Next.js loader (Imports modular loginPage.tsx)
│   │       └── register/           # Endpoint container for /auth/register
│   │           └── page.tsx        # Dynamic Next.js loader (Imports modular registerPage.tsx)
│   ├── globals.css                 # Core CSS & HSL theme color definitions (Tailwind v4 `@theme`)
│   ├── layout.tsx                  # Main HTML wrapper & font loader
│   └── page.tsx                    # Landing page (Next.js default template, style update pending)
├── components/                     # SHARED WIDGETS (Skeletal folders, awaiting custom widgets)
│   ├── anime/                      # Anime-specific components (Cards, lists)
│   ├── common/                     # Global layouts (Header, Footer, Cozy Sidebars)
│   └── ui/                         # Base typography & interactive buttons
├── context/                        # React Context Providers (Awaiting global state & Auth context)
├── hooks/                          # Custom UI React hooks (Awaiting query & scroll binders)
├── lib/                            # Decoupled utility and client libraries
│   ├── api.ts                      # Pre-configured Axios instance for backend connection
│   └── utils.ts                    # Class-name merger helper for dynamic Tailwind classes
├── public/                         # Static local assets and watercolor vectors
├── types/                          # Shared TypeScript type definitions and entities
├── next.config.ts                  # Next.js compiler settings
├── postcss.config.mjs              # PostCSS engine binder
├── package.json                    # Frontend package dependencies (Next, Tailwind v4, Framer Motion)
└── tsconfig.json                   # Client-side compiler configurations

backend/
├── prisma/
│   └── schema.prisma               # Prisma ORM setup (Datasource & Prisma generator)
├── src/
│   ├── configs/                    # Active server configurations
│   │   ├── cors.ts                 # CORS credentials whitelist policy
│   │   ├── prisma.ts               # Prisma relational database client wrapper
│   │   ├── rateLimit.ts            # Rate-limiting middleware (Anti-DDOS)
│   │   └── swagger.ts              # Swagger Spec definitions for OpenAPI endpoints
│   └── index.ts                    # Core server entrypoint (Middleware binding & Health gateway)
├── .env                            # Environmental variables (Database credentials, JWT keys, Port)
├── .env.example                    # Sample template file for backend configurations
├── package.json                    # Server dependencies (Express, Cors, Helmet, Swagger, tsx)
└── tsconfig.json                   # TypeScript compilation settings
```

</details>

<details>
<summary><b>Installation & Configuration Guide</b></summary>
<br />

### Prerequisite Dependencies
Verify that your local system has the following runtimes installed:
- Node.js: `v18.17.0` or higher
- PostgreSQL: `v15` or higher
- Redis Server: `v7.x` or higher

### Environment Setup

#### 1. Backend Config (`/backend/.env`)
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/kagewire?schema=public"
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
JWT_SECRET="kagewire-super-cozy-ghibli-key-2026-auth-session"
JWT_EXPIRATION="7d"
```

#### 2. Frontend Config (`/frontend/.env`)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

---

### Step-by-Step Boot Instructions

#### Step A: Database Setup
Make sure your local PostgreSQL server is active.
```bash
docker run --name kagewire-pg -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=kagewire -p 5432:5432 -d postgres:16
```

#### Step B: Backend Application Boot
```bash
cd backend
npm install
npm run dev
```
The server will boot on `http://localhost:4000`. Access Swagger REST documentation at `http://localhost:4000/api-docs`.

#### Step C: Frontend Next.js Client Boot
```bash
cd frontend
npm install
npm run dev
```
Next.js client will boot at `http://localhost:3000`.

</details>

<details>
<summary><b>Performance & Caching Policies</b></summary>
<br />

To maintain cinematic load times under heavy traffic, KageWire is built to enforce a strict, layered caching system:

- **Redis Caching Strategy** - Trending queries and aggregated news articles are cached inside Redis with an expiration policy of 15 minutes (900 seconds) to prevent rate-limit issues with external APIs.
- **Rate-Limit Safeguards** - Outgoing connections are regulated by an asynchronous queue service to guarantee complete compliance with provider guidelines (e.g., maximum 3 requests per second on Jikan).
- **Next.js Hydration & SSR** - Core landing views compile on the server, serving static HTML and pre-rendered watercolor backdrops, cutting First Contentful Paint (FCP) times down to under 200ms.

</details>


## Roadmap & Future Features

- [ ] **Database Model Seeding** - Writing users, catalog schemas, and ratings models into PostgreSQL via Prisma.
- [ ] **AI-Powered Recommendation Engine** - An advanced recommendation algorithm that suggests anime based on watchlist genres and user reading history.
- [ ] **Real-Time Community Chats** - Live websocket discussion rooms attached to ongoing seasonal anime episodes.
- [ ] **Full Admin Analytics Dashboard** - Graphical representations of server loads, API call allocations, caching ratios, and active users.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
