## 2025-05-14 - Parallel Data Fetching in Server Components
**Learning:** Sequential `await` calls in Next.js Server Components create waterfalls that significantly increase TTFB.
**Action:** Always use `Promise.all` to parallelize independent data fetches.

## 2025-05-14 - Efficient List Filtering
**Learning:** Using `.find()` inside a `.filter()` loop results in $O(N \times M)$ complexity, which can degrade performance as the number of matches grows.
**Action:** Use a `Set` for lookups to achieve $O(N + M)$ complexity.
