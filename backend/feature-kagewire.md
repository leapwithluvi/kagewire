# KageWire Backend

Backend API service for KageWire powered by external anime APIs.

> [!IMPORTANT]
> **Active Development:** This repository is currently under active development. Key core features, databases, and caching layers are in the planning phase.

---

## 📝 Overview

**KageWire Backend** is a highly scalable, modular, and modern Express.js + TypeScript gateway service. It acts as an API gateway designed to aggregate anime news, handle anime discovery, and support robust future fullstack integrations.

The backend acts as the central coordinator between frontend requests and multiple authoritative external anime API providers:
- **Anime News Network** (News feeds & encyclopedia query)
- **Jikan API** (MyAnimeList data proxy)
- **AniList GraphQL API** (Detailed seasonal & modern metadata search)

---

# 🛠️ Tech Stack

Click on each category to expand and explore the technologies powering the KageWire ecosystem.

<details open>
  <summary><b>🟢 Runtime & Core Language</b></summary>

  | Technology | Description | Status |
  | :--- | :--- | :--- |
  | **Node.js** | Next-generation asynchronous, event-driven JavaScript runtime environment. | `Ready` |
  | **Express.js** | Fast, unopinionated, minimalist web framework for routing and middleware. | `Ready` |
  | **TypeScript** | Strongly-typed superset of JavaScript, preventing compile-time bugs. | `Ready` |

</details>

<br>

<details>
  <summary><b>🗄️ Database & ORM Layer</b></summary>

  | Technology | Description | Status |
  | :--- | :--- | :--- |
  | **Prisma ORM** | Next-generation TypeScript ORM for robust schema generation and type-safe database queries. | `Ready` |
  | **PostgreSQL** | Industry-standard open-source relational database to support persistent user data. | `🛠️ Planned` |

</details>

<br>

<details>
  <summary><b>🔐 Authentication & Cryptography</b></summary>

  | Technology | Description | Status |
  | :--- | :--- | :--- |
  | **JSON Web Tokens (JWT)** | Compact, URL-safe means of representing claims securely between client and server. | `Ready` |
  | **bcryptjs** | Optimized Blowfish-based password hashing algorithm for secure credential storage. | `Ready` |

</details>

<br>

<details>
  <summary><b>✅ Validation & Schema Enforcement</b></summary>

  | Technology | Description | Status |
  | :--- | :--- | :--- |
  | **Zod** | TypeScript-first schema declaration and runtime validation library with static type inference. | `Ready` |

</details>

<br>

<details>
  <summary><b>🛡️ Security & Attack Mitigation</b></summary>

  | Technology | Description | Status |
  | :--- | :--- | :--- |
  | **Helmet** | Secures Express apps by setting various appropriate HTTP response headers. | `Ready` |
  | **HPP** | Express middleware to protect against HTTP Parameter Pollution attacks. | `Ready` |
  | **Express Rate Limit** | Basic rate-limiting middleware to secure APIs from brute-force attempts and spam. | `Ready` |

</details>

<br>

<details>
  <summary><b>⚡ Performance & Caching</b></summary>

  | Technology | Description | Status |
  | :--- | :--- | :--- |
  | **Redis** | High-performance in-memory data structure store used as a fast caching layer. | `🛠️ Planned` |

</details>

<br>

<details>
  <summary><b>📖 Documentation & API Specifications</b></summary>

  | Technology | Description | Status |
  | :--- | :--- | :--- |
  | **Swagger UI** | Beautiful, interactive frontend interface mapping all REST API endpoints. | `Ready` |
  | **Swagger JSDoc** | Generates OpenAPI-compliant specs dynamically via inline JSDoc comments. | `Ready` |

</details>

---

# 📦 Dependency Reference

All dependencies are carefully selected to maintain a clean, stable, and secure codebase. Expand each section below to inspect the package specifications.

<details>
  <summary><b>🚀 Core Dependencies</b></summary>

  | Dependency | Purpose | Details & Use Case |
  | :--- | :--- | :--- |
  | `express` | Web Framework | Underpins the router and server runtime. |
  | `cors` | Network Access | Configures Cross-Origin Resource Sharing for frontend communication. |
  | `dotenv` | Config Loader | Safely maps environment configurations from `.env` files. |
  | `axios` | HTTP Client | Performs promise-based asynchronous requests to external anime APIs. |
  | `helmet` | HTTP Security | Injects secure HTTP response headers automatically. |
  | `hpp` | Security Middleware | Guards routing filters against HTTP Parameter Pollution. |
  | `compression` | Network Efficiency | Shrinks responses to speed up client-side page load times. |
  | `morgan` | Request Logging | Standard HTTP request logger middleware for live traffic debugging. |
  | `express-rate-limit` | Traffic Throttler | Limits maximum requests per client window to avoid server spam. |
  | `cookie-parser` | Request Parser | Parses cookies easily for authorization and session handling. |
  | `zod` | Validation | Validates request payloads and query parameters before reaching controllers. |
  | `bcryptjs` | Hashing Library | Hashes user passwords securely in the database. |
  | `jsonwebtoken` | Token Generation | Generates cryptographic tokens for stateful user access. |
  | `redis` | Cache Client | Future provider integration wrapper to query Redis cache. |
  | `swagger-ui-express` | Documentation | Mounts the interactive Swagger playground at `/api/docs`. |
  | `swagger-jsdoc` | OpenAPI Generator | Compiles TypeScript routes and schemas into an OpenAPI schema. |
  | `@prisma/client` | DB Client | Auto-generated custom TypeScript API matching the database models. |

</details>

<br>

<details>
  <summary><b>🛠️ Development Dependencies</b></summary>

  | Dependency | Purpose | Description |
  | :--- | :--- | :--- |
  | `typescript` | Language Runtime | Native compiler and language service support for type safety. |
  | `tsx` | Speed Execution | Fast TypeScript watcher executing TS files instantly in dev mode. |
  | `nodemon` | Hot Reloading | Standard file monitor restart script for fluid local development. |
  | `prisma` | DB Toolkit | Prisma CLI command runner for schema edits and DB sync. |
  | `@types/*` | Static Types | Standard typing wrappers for TypeScript support on library packages. |
  | `eslint` | Quality Linter | Detects structural patterns, standardizes styling, and spots bugs. |
  | `prettier` | Formatter | Opinionated code formatter keeping styling strictly consistent. |
  | `eslint-config-prettier` | Prettier Support | Ensures standard formatting rules from Prettier do not clash with ESLint. |
  | `@typescript-eslint/parser` | ESLint Parser | Facilitates the execution of ESLint queries over TS source trees. |
  | `@typescript-eslint/eslint-plugin` | ESLint Plugin | Injects standard TS-specific rules to enforce clean static types. |

</details>

---

# 🎯 Feature Roadmap

The current scope of planned KageWire backend features and target modules:

| Module / Feature | Category | Target Release | Status |
| :--- | :--- | :---: | :---: |
| **Anime News Aggregator** | Core Integration | v1.0.0 | `🔄 Planned` |
| **Anime Search System** | Discovery Module | v1.0.0 | `🔄 Planned` |
| **Trending Anime Engine** | Data Aggregation | v1.1.0 | `🔄 Planned` |
| **Seasonal Anime Filter** | Discovery Module | v1.1.0 | `🔄 Planned` |
| **Personalized Recommendations** | AI / Data Science | v2.0.0 | `🔄 Planned` |
| **Watchlist & Bookmarks** | User Integration | v1.2.0 | `🔄 Planned` |
| **JWT Authentication System** | Core Infrastructure | v1.0.0 | `🔄 Planned` |
| **Role-Based Access Control (RBAC)**| User Security | v1.2.0 | `🔄 Planned` |
| **API Cache Layers (Redis)** | Performance | v1.5.0 | `🔄 Planned` |
| **Search Queries Optimization** | Performance | v1.6.0 | `🔄 Planned` |
| **Core Admin Dashboard** | Management Portal | v2.0.0 | `🔄 Planned` |
| **Swagger API Sandbox** | Developer Tools | v1.0.0 | `🔄 Planned` |

---

# 🌐 API Providers Integration

The gateway dynamically leverages external data sources to deliver premium anime indices:

| Provider | Integration Architecture | Purpose | Base API URL |
| :--- | :--- | :--- | :--- |
| **Anime News Network** | REST (XML Parser) | Live articles, encyclopedia listings, feeds | `https://cdn.animenewsnetwork.com/encyclopedia/api.xml` |
| **Jikan API** | REST (JSON Client) | Anime metadata search, character info, episodes | `https://api.jikan.moe/v4/` |
| **AniList API** | GraphQL Client | Advanced visual feeds, seasonal trends, user syncing | `https://graphql.anilist.co` |

---

# 📐 System Architecture

Below is the conceptual high-level routing and communication flow between users, the KageWire Gateway, and external systems:

```mermaid
graph TD
    classDef client fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef gateway fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef provider fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    Frontend[Frontend React Application]:::client
    API[KageWire Express API Gateway]:::gateway
    
    ANN[Anime News Network API]:::provider
    Jikan[Jikan MyAnimeList API]:::provider
    AniList[AniList GraphQL API]:::provider

    Frontend -->|HTTP Requests| API
    API -->|XML Feeds / Axios| ANN
    API -->|REST Queries / Axios| Jikan
    API -->|GraphQL POST / Axios| AniList
```

---

# 📁 Project Structure

```txt
src/
 ├── configs/       # Global app configurations (.env parser, database pool)
 ├── controllers/   # Controllers receiving HTTP payloads, sending standard responses
 ├── docs/          # Open API/Swagger configuration setup and schemas
 ├── lib/           # Third-party SDK client wrappers and network classes
 ├── middlewares/   # Express middlewares (Authorization checker, payload validator)
 ├── routes/        # Router files organizing endpoints to respective handlers
 ├── services/      # Business logic layer isolating database queries & API calls
 ├── utils/         # Lightweight shared helper scripts and utilities
 ├── validators/    # Zod payload structures representing strict request body schemas
 └── server.ts      # HTTP server bootstrapping and socket listener
```

---

# 🚀 Getting Started

Follow the structural steps below to spin up your local KageWire Backend development server.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** / **pnpm** / **yarn**
- **PostgreSQL** database instance (recommended)
- **Redis** server running locally (optional)

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/leapwithluvi/kagewire.git
cd kagewire/backend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Environment Configuration
Copy the sample environment template and populate it with your local credentials:
```bash
cp .env.example .env
```

Open `.env` and configure:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/kagewire"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret-key-goes-here"
JWT_EXPIRES_IN="7d"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

#### 4. Generate Prisma Models
```bash
npx prisma generate
```

#### 5. Launch the Development Server
```bash
npm run dev
```
The console will log the active port. By default, the server is available at:
`http://localhost:3000`

---

# 🛠️ Development & Commands

### Running Locally
To launch Node in watch mode, triggering hot-reloading automatically upon saving:
```bash
npm run dev
```

### Production Build
Compile TypeScript files to optimized JavaScript bundles and run:
```bash
npm run build
npm start
```

---

# 📖 Interactive API Documentation

### 🟢 Live Health Check
To check the online status of the API service, make a request to:
```http
GET /api/v1/health
```

### 📘 Swagger Playground
Explore and test the live routing sandbox directly through your browser at:
`http://localhost:3000/api/docs`

---

# 🛡️ Built-in Security Features

The gateway is built with strict production-ready security layers out of the box:

- **Helmet Middleware:** Mitigates common vulnerabilities by setting secure headers.
- **HPP Middleware:** Halts Parameter Pollution to avoid query-manipulation attacks.
- **Express Rate Limiter:** Protects from API overload:
  ```ts
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                 // Limit each IP to 100 requests per window
  });
  app.use("/api/", limiter);
  ```

---

# ⚡ Performance & Caching Strategy

Optimized with modular Redis integration models to speed up repeat requests and prevent third-party API rate limiting:
- **API Response Caching:** Temporarily holds aggregated news lists for fast repeat reads.
- **Database Query Caching:** Speeds up auth validation checks and watchlist queries.
- **Client Session Caching:** Manages lightweight state tokens.

---

# 🧪 Testing Procedures

Run integrated test suites with these built-in scripts:

- **Run Unit Tests:** `npm test`
- **Coverage Audits:** `npm run test:coverage`
- **E2E Integration Checks:** `npm run test:e2e`

---

# 🐳 Docker Deployment

You can build and deploy the containerized environment using Docker:

```bash
# Build the Docker image
docker build -t kagewire-backend .

# Run the container mapping ports locally
docker run -p 3000:3000 --env-file .env kagewire-backend
```

---

# 🤝 Contribution Guidelines

We welcome community contributions! Please follow the steps below:

1. Fork the project repository.
2. Create a clean feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit and describe your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request for our team's review.

---

# 📄 License

This project is licensed under the **MIT License**. For full terms and copyright details, please refer directly to the root [LICENSE](/LICENSE) file.
