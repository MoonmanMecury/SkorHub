## 2025-05-15 - Parallel Data Fetching & Algorithm Optimization

**Learning:** Sequential `await` calls in Next.js Server Components (TTFB bottleneck) and nested filtering ($O(N*M)$) were significantly slowing down the Home and Category pages. Parallelizing fetches with `Promise.all()` and using a `Set` for $O(1)$ lookups reduced complexity to $O(N)$.

**Action:** Always audit Server Components for independent `await` calls and replace them with `Promise.all()`. For list filtering based on another list's inclusion, use a `Set` to avoid quadratic time complexity.
