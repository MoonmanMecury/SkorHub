## 2026-07-02 - Parallel Data Fetching & O(N) Filtering
**Learning:** Server-side data fetching in Next.js pages often falls into the trap of sequential `await` calls. Parallelizing independent requests with `Promise.all` directly impacts TTFB and Largest Contentful Paint (LCP). Additionally, using a `Set` for membership checks in filters (e.g., checking if a match is live) reduces complexity from O(N*M) to O(N), which is critical for pages with large event lists.
**Action:** Always audit `async` components for sequential fetches and use hash-based lookups for collection filtering.
