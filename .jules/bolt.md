## 2025-05-22 - Parallelizing Sequential Awaits in Next.js Server Components
**Learning:** Sequential 'await' calls in Server Components create a request waterfall, significantly increasing TTFB.
**Action:** Always use 'Promise.all' for independent data fetches to parallelize requests and reduce page load latency.
