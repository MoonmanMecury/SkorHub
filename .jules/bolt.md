## 2025-06-28 - Home Page Parallelization and Filtering
**Learning:** Sequential awaits in Next.js Server Components create unnecessary waterfall latency. Algorithmic complexity in list filtering (O(N*M)) can become a bottleneck as the dataset grows.
**Action:** Always use `Promise.all` for independent data fetches in Server Components. Prefer `Set` for lookups when filtering one list against another to achieve O(N) complexity.
