## 2025-05-14 - Optimized Parallel Fetching and Set Lookups
**Learning:** Sequential `await` calls in Next.js Server Components create unnecessary waterfall delays. Using `Promise.all` can significantly reduce page load time by parallelizing I/O. Additionally, O(N*M) filtering logic (e.g., filtering matches by checking against another array) can be optimized to O(N+M) using a `Set`.
**Action:** Always look for sequential data fetches in page components and evaluate if they can be parallelized. Use `Set` or `Map` for efficient lookups when filtering or mapping related data collections.
