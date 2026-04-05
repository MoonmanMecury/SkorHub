## 2025-05-14 - Parallel Data Fetching in Server Components
**Learning:** Sequential `await` calls in Next.js Server Components create waterfalls that significantly increase TTFB. Fetching independent data (e.g., sports categories, live matches, and all matches) in parallel using `Promise.all` reduces overall latency.
**Action:** Always look for independent `await` calls in server components and parallelize them.

## 2025-05-14 - Targeted API Retrieval
**Learning:** Fetching a global dataset and filtering it in-memory (e.g., `allMatches.filter(...)`) is less efficient than using specialized API endpoints (e.g., `getMatchesBySport(id)`) that return only the necessary data. This reduces network payload and client/server processing.
**Action:** Prefer specialized API endpoints over in-memory filtering of large datasets.
