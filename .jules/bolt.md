## 2026-06-02 - Parallel Data Fetching in Category Page
**Learning:** Parallelizing independent API requests with `Promise.all` and using targeted endpoints significantly reduces page load time and over-fetching.
**Action:** Always check if targeted API endpoints exist before falling back to client-side filtering of large datasets.
