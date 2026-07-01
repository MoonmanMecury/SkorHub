## 2026-07-01 - Optimizing Data Fetching and Filtering
**Learning:** Sequential awaits in Next.js Server Components for data fetching significantly increase TTFB. Client-side/Server-side filtering of large collections when targeted API endpoints exist (e.g., fetching all matches instead of by category) is a common performance anti-pattern in this codebase. Additionally, O(N*M) filtering can be easily optimized to O(N) using Sets.
**Action:** Always check for targeted API endpoints and parallelize fetches with Promise.all. Use Set for ID lookups when filtering one list against another.
