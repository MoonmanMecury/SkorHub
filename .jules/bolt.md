## 2026-05-04 - Parallelize Data Fetching on Home Page
**Learning:** Sequential await calls in Server Components increase TTFB as each request must complete before the next starts.
**Action:** Use Promise.all to fetch independent data concurrently.
