## 2025-05-15 - Optimizing Home Page Data Fetching and Filtering
**Learning:** Sequential awaits for multiple independent API calls in a Server Component significantly increase TTFB. Additionally, filtering large lists using `.find()` inside a `.filter()` loop results in O(N*M) complexity, which can be optimized to O(N+M) using a `Set`.
**Action:** Always parallelize independent API calls with `Promise.all` and use `Set` for efficient lookups when filtering or checking for existence in collections.
