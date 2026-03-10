## 2025-05-14 - Parallelize Data Fetching and Set Optimization
**Learning:** Sequential 'await' calls for multiple independent API requests significantly increase TTFB and overall page load time.
**Action:** Use 'Promise.all' to parallelize data fetches. For list lookups during rendering (e.g., filtering matches against a list of live IDs), use a 'Set' for O(1) lookups to avoid O(N*M) nested search loops.

## 2025-05-14 - Granular API Methods
**Learning:** Fetching a complete list from an API and filtering it on the server can be inefficient if the API supports granular endpoints.
**Action:** Prefer specific API methods (e.g., 'getMatchesBySport(id)') over fetching all and filtering manually.
