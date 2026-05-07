## 2026-05-07 - Parallelized Data Fetching and Optimized Filtering
**Learning:** Sequential await calls in Next.js Server Components (Server-Side Rendering) block the main thread and significantly increase TTFB. Using `Promise.all` for independent data streams and `Set` for O(1) lookups instead of O(N) filtering improves both server-side and client-side efficiency.
**Action:** Always check for independent async calls in Server Components and parallelize them. Prefer specialized API endpoints (like `getMatchesBySport`) over fetching large datasets and filtering in memory.
