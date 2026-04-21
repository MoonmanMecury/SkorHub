## 2026-04-18 - Parallelizing Data Fetches on Home Page
**Learning:** Sequential `await` calls in Next.js Server Components create network waterfalls that significantly increase TTFB.
**Action:** Use `Promise.all` to parallelize independent data fetches.
