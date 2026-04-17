## 2025-05-15 - Parallel Data Fetching & Optimized Filtering
**Learning:** Sequential `await` calls in Next.js Server Components create unnecessary network waterfalls, significantly increasing TTFB. Additionally, filtering large arrays using `.some()` or `.includes()` inside a `.filter()` results in $O(N \cdot M)$ complexity.
**Action:** Use `Promise.all` for independent data fetches and convert lookup arrays into `Set` objects to achieve $O(N+M)$ complexity for filtering.
