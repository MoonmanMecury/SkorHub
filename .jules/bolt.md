## 2026-04-18 - Optimized Home Page Performance
**Learning:** Sequential await calls for independent data fetching operations in Next.js Server Components can significantly increase TTFB. Additionally, filtering a large dataset against another list using `.find` within `.filter` results in O(N*M) complexity, which can be optimized to O(N+M) using a `Set`.
**Action:** Always look for opportunities to parallelize data fetching with `Promise.all` and use appropriate data structures like `Set` or `Map` for efficient lookups in filtering or mapping operations.
