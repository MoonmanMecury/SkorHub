## 2026-06-06 - Parallelizing Home Page Data Fetching
**Learning:** Sequential `await` calls in Next.js Server Components create a performance waterfall that increases TTFB. Parallelizing independent API requests with `Promise.all` can significantly reduce total data fetching time.
**Action:** Always check for independent data fetches in the entry points of pages (especially Home) and parallelize them using `Promise.all` to improve initial load performance.
