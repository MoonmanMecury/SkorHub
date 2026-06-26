## 2025-05-15 - Eliminating Data Fetching Waterfalls in Home Page

**Learning:** The Home page (`app/(main)/page.tsx`) was fetching `liveMatches`, `allMatches`, and `sports` sequentially using `await`. This created a "waterfall" where each subsequent request had to wait for the previous one to complete, significantly increasing TTFB. Additionally, filtering out live matches from the full list was using an O(N*M) nested `find` operation.

**Action:** Parallelized data fetching using `Promise.all` to fetch all three resources concurrently. Implemented a `Set` for match IDs to optimize filtering of upcoming matches to O(N) complexity. Explicitly typed the category reducer to avoid `any` and potential performance bailouts in the TypeScript compiler/runtime.
