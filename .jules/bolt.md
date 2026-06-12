# Bolt's Performance Journal

## 2026-06-12 - Parallelizing Data Fetching in Home Page
**Learning:** Sequential `await` calls in Server Components create a data-fetching waterfall, where each request must complete before the next one starts. In `app/(main)/page.tsx`, fetching live matches, all matches, and sports categories independently was causing unnecessary latency.
**Action:** Use `Promise.all` to parallelize independent data fetches in Server Components to minimize the total time spent waiting for I/O.
