## 2026-07-05 - Optimizing Data Fetching and Filtering
**Learning:** Sequential awaits in Next.js Server Components create unnecessary waterfalls. Parallelizing with `Promise.all` and utilizing targeted API endpoints significantly improves Time to First Byte (TTFB). For filtering, `Set` lookups provide O(1) complexity compared to O(N) for `find` or `includes` within loops.
**Action:** Always check for opportunities to use `Promise.all` when multiple independent data sources are required, and prefer targeted API endpoints over full-collection fetching and client-side filtering.
