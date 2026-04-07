## 2025-05-14 - Parallel Data Fetching in Server Components
**Learning:** Sequential awaits in Next.js Server Components create unnecessary network waterfalls, increasing TTFB. Using `Promise.all` can significantly reduce page load time when multiple independent data sources are required.
**Action:** Always check for independent data fetches in Server Components and parallelize them where possible.
