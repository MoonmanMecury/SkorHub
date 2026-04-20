## 2026-04-18 - Optimized Home Page and Match Retrieval
**Learning:** Sequential `await` calls in Next.js Server Components create network waterfalls that significantly increase TTFB. Additionally, filtering large lists using nested `.find()` or `.filter()` calls results in O(N*M) complexity, which scales poorly.
**Action:** Always parallelize independent data fetches with `Promise.all`. Use a `Set` for O(1) lookups when performing list exclusions or intersections to maintain O(N+M) performance.
