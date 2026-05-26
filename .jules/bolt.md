## 2025-05-26 - Optimized category page data fetching
**Learning:** Optimizing category pages by parallelizing data fetching and using targeted API calls (e.g., `getMatchesBySport`) reduces total fetch time and minimizes memory/bandwidth usage by avoiding full dataset processing.
**Action:** Always check if targeted API endpoints are available before resorting to client-side or server-side filtering of large datasets. Use `Promise.all` for independent data fetches.
