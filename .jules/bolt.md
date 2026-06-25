## 2025-05-14 - Parallel Fetching and Set-based Filtering in Home Page

**Learning:** The Home page was suffering from a network waterfall due to sequential `await` calls and an $O(N*M)$ filtering operation. Parallelizing with `Promise.all` and using a `Set` for lookups reduced latency by ~39% (371ms -> 225ms).

**Action:** Always check for sequential `await` calls in Next.js Server Components and prefer `Set` over `.find()` inside `.filter()` for large datasets.
