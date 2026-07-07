## 2026-07-07 - Parallel Data Fetching and Set Optimization
**Learning:** Sequential await calls in Next.js Server Components create waterfalls that significantly increase TTFB. Using Set for lookups in filters improves performance from O(N*M) to O(N).
**Action:** Always parallelize independent fetches using Promise.all and use Set for membership checks in loops.
