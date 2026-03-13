## 2025-05-14 - Parallel Data Fetching and Set-based Filtering
**Learning:** Sequential await calls in Next.js Server Components create a waterfall that increases TTFB. Additionally, filtering large lists using `.find()` or `.includes()` inside a `.filter()` results in O(N*M) complexity, which becomes a bottleneck as data grows.
**Action:** Use `Promise.all` for independent data fetches and prefer `Set` for O(1) lookups during list filtering to achieve O(N) complexity.
