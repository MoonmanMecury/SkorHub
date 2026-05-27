## 2025-05-15 - Category Page Optimization
**Learning:** Sequential data fetching waterfalls and over-fetching (e.g., calling `getAllMatches` when a sport-specific endpoint exists) are significant bottlenecks in this application's server components. Parallelizing requests with `Promise.all` and using targeted API endpoints is the most effective way to reduce TTFB.
**Action:** Always check `streamedApi` for targeted fetch methods (like `getMatchesBySport`) before defaulting to `getAllMatches` and client-side filtering. Ensure `Promise.all` is used for independent data dependencies.
