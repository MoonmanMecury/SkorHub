## 2025-05-14 - Parallel Data Fetching & Set-based Filtering
**Learning:** Sequential data fetching for independent resources on the Home page created a waterfall that delayed the initial render. Additionally, O(N*M) filtering of live matches from the all-matches list became a bottleneck as the dataset grew.
**Action:** Use `Promise.all` for parallel fetching of independent resources. Implement `Set` for ID lookups to reduce filtering complexity to O(N).
