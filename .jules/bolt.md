## 2025-05-22 - Parallelization and Targeted API Calls in Category Pages
**Learning:** Sequential data fetching in server components (waterfalls) and fetching all data then filtering client-side (anti-pattern) are major performance bottlenecks. Parallelizing with `Promise.all` and using targeted API endpoints (like `getMatchesBySport`) can cut load times by ~50% and reduce resource usage significantly.
**Action:** Always check if a targeted API endpoint exists before using a generic `getAll` method and parallelize independent fetch calls in server components.
