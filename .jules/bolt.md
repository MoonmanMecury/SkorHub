# Bolt's Performance Journal

## 2025-05-14 - Parallel Data Fetching and Efficient Filtering on Home Page
**Learning:** Identifying a data fetching waterfall and an O(N*M) filtering bottleneck on the main landing page. Using `Promise.all` can significantly reduce TTFB by parallelizing independent API calls. Using a `Set` for ID lookups reduces filtering overhead from linear to constant time per item.
**Action:** Always check for waterfalls in server components that fetch multiple independent data sets. Use `Set` for ID lookups when filtering one collection against another.
**Impact:**
- Parallelizing 3 API calls reduces data fetching time from roughly the sum of all 3 calls to the maximum of any single call (expected ~66% reduction in fetch time).
- Optimizing live match filtering from O(N*M) to O(N) by using a `Set` for lookups, where N is total matches and M is live matches.
