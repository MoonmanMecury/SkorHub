## 2025-05-14 - Parallel Data Fetching & Efficient Filtering

**Learning:** In Next.js Server Components, fetching data sequentially (waterfall) significantly increases page load time. Additionally, using `Array.prototype.find()` inside `Array.prototype.filter()` results in O(N*M) complexity, which can be optimized to O(N+M) using a `Set`.

**Action:** Always use `Promise.all` for independent data fetches in server components. For filtering against another list, convert the lookup list into a `Set` for O(1) average-time complexity lookups.
