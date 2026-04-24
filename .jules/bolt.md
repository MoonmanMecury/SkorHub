## 2026-04-18 - Optimized List Filtering and Parallelized Data Fetching
**Learning:** Using `Set` for O(1) lookups during list filtering significantly improves performance when excluding items from one list that appear in another (reducing complexity from O(N*M) to O(N+M)). Parallelizing independent data fetching calls in Next.js Server Components using `Promise.all` reduces total server-side latency and improves TTFB.
**Action:** Always prefer `Set` for membership checks in loops and parallelize independent `await` calls to maximize concurrency.
