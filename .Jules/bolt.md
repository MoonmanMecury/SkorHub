## 2025-05-22 - Optimizing Home Page Data Fetching
**Learning:** Sequential data fetching in Next.js Server Components can lead to high TTFB as each request must wait for the previous one. Parallelizing with `Promise.all` significantly improves performance.
**Action:** Always parallelize independent data fetches in server components.
