## 2026-05-15 - Optimize Category Page Data Fetching
**Learning:** Sequential await calls in Next.js Server Components create waterfalls that delay rendering. Fetching all matches and filtering client-side is inefficient when a targeted API endpoint exists.
**Action:** Use `Promise.all` for parallel fetching and leverage specialized API methods like `getMatchesBySport(id)` to minimize data overhead.
