## 2026-04-30 - Optimizing Server-Side Data Fetching
**Learning:** Sequential `await` calls in Next.js Server Components block the execution and increase TTFB. Using `Promise.all` allows parallel execution and significant performance gains. Additionally, using specific API endpoints like `getMatchesBySport(id)` is far more efficient than fetching all data and filtering in-memory.
**Action:** Always look for opportunities to parallelize independent data fetches and use the most granular API methods available to reduce payload size and processing time.
