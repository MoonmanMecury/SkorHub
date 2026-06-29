## 2025-05-14 - Parallelized Home Page Data Fetching

**Learning:** The Home page was previously fetching `liveMatches`, `allMatches`, and `sports` sequentially, leading to an additive latency penalty. Additionally, filtering "Upcoming & Recent" matches was $O(N \cdot M)$ due to nested array lookups.

**Action:** Always use `Promise.all` for independent data fetches in Next.js Server Components. For filtering large datasets against another collection, convert the lookup collection into a `Set` to achieve $O(1)$ lookup time and $O(N)$ overall complexity.
