## 2025-05-14 - Optimized data fetching in main routes
**Learning:** Data fetching for `liveMatches`, `allMatches`, and `sports` in `app/(main)/page.tsx` was sequential, causing increased TTFB. Additionally, filtering upcoming matches used an $O(N \times M)$ nested `find` inside a `filter`.
**Action:** Parallelized fetching using `Promise.all` and optimized filtering by using a `Set` for $O(1)$ ID lookups, resulting in $O(N)$ total complexity. Switched to sport-specific endpoints in category pages to reduce payload size.
