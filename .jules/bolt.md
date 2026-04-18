## 2026-04-18 - Parallelizing Home Page Fetches
**Learning:** Sequential data fetching in Next.js Server Components creates unnecessary network waterfalls, significantly increasing TTFB.
**Action:** Always use `Promise.all` for independent data fetches in server components to improve performance.
