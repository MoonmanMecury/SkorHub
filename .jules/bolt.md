## 2026-06-10 - Parallelize sequential data fetching
**Learning:** Sequential `await` calls in Server Components create a waterfall bottleneck, especially when fetching from external APIs with significant latency (300ms+). This drastically increases the page load time (TTFB).
**Action:** Always use `Promise.all` for independent data fetches in Server Components to execute them concurrently and minimize total latency.
