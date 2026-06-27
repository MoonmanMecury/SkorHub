## 2025-05-15 - Waterfall Latency and Collection Over-fetching
**Learning:** Sequential `await` calls in Next.js Server Components create unnecessary waterfalls. Additionally, fetching a full collection (e.g., `getAllMatches`) only to filter it by category increases network payload and client-side processing.
**Action:** Always use `Promise.all` for independent data fetches and prefer targeted API endpoints (like `getMatchesBySport`) over client-side filtering of global collections.
