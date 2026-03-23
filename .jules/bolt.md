## 2026-03-23 - Parallelize Homepage Data Fetching
**Learning:** In Next.js Server Components, sequential `await` calls for independent data sources introduce unnecessary latency. Parallelizing these requests with `Promise.all` can significantly reduce the Time to First Byte (TTFB) and overall page load time.
**Action:** Always check for independent `await` calls in Server Components and parallelize them when they don't depend on each other's results.
