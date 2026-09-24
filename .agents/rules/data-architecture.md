# Data & Architecture Constraints

1. **Content Provider**:
   - KageWire does **not** own or maintain the primary anime, donghua, or comic content database.
   - **SankaApi** is the external upstream data provider.

2. **No Redundant Backend / Database**:
   - Do **not** create a separate content database, CMS, authentication system, or standalone backend service unless explicitly requested by the user.

3. **BFF / Proxy Layer**:
   - Use Next.js Server Components and Route Handlers as a lightweight Backend-for-Frontend (BFF) / API proxy layer where beneficial (e.g. rate limit protection, response normalization, caching).

4. **Client State**:
   - User watchlist, bookmarks, and reading history remain client-side (e.g. `localStorage` via `src/lib/store.ts`).
