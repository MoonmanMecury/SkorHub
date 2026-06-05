## 2026-06-05 - Home Page Optimization
**Learning:** Sequential data fetching in Next.js Server Components creates avoidable network waterfalls. Parallelizing with `Promise.all` and optimizing filtering logic from O(N*M) to O(N+M) using a `Set` significantly improves TTFB and CPU efficiency during SSR.
**Action:** Always check for independent `await` calls in Server Components and parallelize them. Prefer `Set` over nested `find`/`includes` for filtering large datasets.
