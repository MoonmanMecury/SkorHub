# Bolt Performance Journal

## 2025-05-14 - Parallelize Data Fetching and Optimize List Filtering
**Learning:** In Next.js App Router Server Components, independent `await` calls block the main thread sequentially. Parallelizing these fetches with `Promise.all` can significantly reduce Time to First Byte (TTFB). Additionally, list filtering using nested `.find()` calls results in O(N*M) complexity, which can be optimized to O(N) by using a `Set` for O(1) lookups.
**Action:** Always check for opportunities to use `Promise.all` for independent data fetches and prefer `Set` for list intersection/difference operations in data-heavy components.
