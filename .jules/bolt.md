## 2025-05-15 - Optimizing Server-Side Data Fetching in Next.js

**Learning:** Sequential `await` calls in Next.js Server Components create a request waterfall, increasing the Time to First Byte (TTFB). Parallelizing independent data fetches using `Promise.all` can significantly reduce overall page load time by up to 30-50% depending on the API's latency. Additionally, using targeted API endpoints (e.g., `getMatchesBySport(id)`) instead of broad fetches (e.g., `getAllMatches()`) with server-side filtering reduces network payload and CPU processing.

**Action:** Always parallelize independent data fetches in Server Components and prefer targeted API endpoints over broad fetches with server-side filtering. Ensure that URL parameters are normalized (e.g., to lowercase) before calling APIs if case-insensitivity is required.
