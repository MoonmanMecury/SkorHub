## 2026-06-08 - Eliminate data-fetching waterfall on Home page
**Learning:** Sequential await calls in Next.js Server Components create a performance waterfall that increases TTFB (Time to First Byte).
**Action:** Always parallelize independent data fetches using `Promise.all` to ensure the server response time is limited by the slowest single request rather than the sum of all requests.
