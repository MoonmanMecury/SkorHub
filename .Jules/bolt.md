## 2025-05-14 - Parallel Fetching and O(N) Filtering
**Learning:** Sequential await calls in Next.js Server Components create waterfalls that delay TTFB. Also, nested array lookups (filter + find) in render loops result in O(N*M) complexity, which can be optimized to O(N) using a Set.
**Action:** Always parallelize independent data fetches with Promise.all and use Sets for lookup-heavy filtering operations.
