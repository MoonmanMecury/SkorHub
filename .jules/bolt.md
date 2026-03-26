## 2025-05-14 - Parallelizing data fetches in Server Components
**Learning:** Sequential `await` calls for independent data sources in Next.js Server Components increase TTFB significantly as each request must wait for the previous one to complete.
**Action:** Use `Promise.all` to fetch independent data sources concurrently in Server Components to minimize latency and improve page load speed.
