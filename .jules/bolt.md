## 2025-05-09 - Parallel Data Fetching & Set Lookups
**Learning:** Sequential `await` calls for independent data sources in Next.js Server Components create unnecessary bottlenecks. Additionally, using `.filter()` with a nested `.find()` on two large arrays results in O(N*M) complexity, which can be significantly optimized.
**Action:** Use `Promise.all` to fetch independent data sources concurrently and convert arrays to `Set` for O(1) lookups during filtering to achieve O(N) overall complexity.
