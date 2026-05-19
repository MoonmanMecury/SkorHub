## 2025-05-19 - [Data Fetching] Parallelize and Specialize
**Learning:** Sequential data fetching in server components (waterfalls) and client-side filtering of large datasets are significant performance bottlenecks. The `streamedApi` provides specialized endpoints like `getMatchesBySport(id)` that should be used instead of filtering the results of `getAllMatches()` to reduce payload size and processing time.
**Action:** Always parallelize independent fetch calls using `Promise.all` and prefer specialized API endpoints over client-side filtering of aggregate data.
