## 2025-03-20 - Parallel Data Fetching and O(1) Lookups
**Learning:** Sequential `await` calls in Next.js Server Components (Home and Category pages) were significantly delaying TTFB. Additionally, nested `.find()` inside `.filter()` created O(N*M) bottlenecks for list rendering.
**Action:** Always use `Promise.all` for independent data fetches and prefer `Set` for membership checks during list filtering. Move complex filtering logic out of JSX into the component body to maintain readability and avoid IIFEs.
