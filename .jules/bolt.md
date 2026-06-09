## 2026-06-09 - Targeted API fetching for Category Pages
**Learning:** The Category page was previously fetching the entire match dataset (~100+ items) and filtering them in memory by sport ID. This resulted in excessive data transfer and O(N) filtering overhead for every request. Using the specialized `streamedApi.getMatchesBySport(id)` endpoint significantly reduces the payload size and offloads filtering to the backend/API layer.
**Action:** Always audit pages for 'fetch-all-then-filter' patterns and prioritize targeted API endpoints to minimize data transfer and server-side compute.
