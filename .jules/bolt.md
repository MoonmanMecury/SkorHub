## 2025-05-15 - [Home Page Optimization]
**Learning:** Sequential data fetching in Next.js Server Components creates waterfalls that multiply TTFB. Nesting `.find()` in `.filter()` results in O(N*M) complexity, which is noticeably slower for larger datasets.
**Action:** Use `Promise.all` for parallel fetching and `Set` for O(1) lookups in filtering operations to maintain O(N+M) complexity.
