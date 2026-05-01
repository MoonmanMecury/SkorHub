## 2025-03-24 - Parallelizing Data Fetching and Efficient Filtering
**Learning:** Sequential `await` calls in Next.js Server Components create a waterfall effect that linearly increases Time to First Byte (TTFB). Additionally, filtering large arrays using `.find()` inside a `.filter()` results in $O(N \times M)$ complexity, which can noticeably lag the server-side processing for high-traffic pages.
**Action:** Always use `Promise.all()` for independent data fetches and leverage `Set` for $O(1)$ lookups when deduplicating or filtering lists by ID.
