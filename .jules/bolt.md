## 2026-04-18 - Optimized data fetching and list filtering
**Learning:** Sequential `await` calls in Next.js Server Components block the main thread and increase TTFB. Using `Promise.all` can significantly reduce latency. Additionally, using `Set` for O(1) lookups in list filtering is much more efficient than nested loops as the list size grows.
**Action:** Always look for independent data fetching calls that can be parallelized, and use appropriate data structures like `Set` or `Map` for frequent lookups in large datasets.
