## 2025-05-15 - Waterfall Reduction and O(N) Filtering
**Learning:** Sequential `await` calls in Next.js Server Components create unnecessary TTFB bottlenecks. Parallelizing independent data fetches with `Promise.all` is a high-impact, low-complexity win. Additionally, using a `Set` for lookups in large match lists prevents O(N*M) performance degradation.
**Action:** Always check for independent `await` calls in page-level components and consider `Promise.all`. Use `Set` or hash maps for filtering/grouping operations on match data.
