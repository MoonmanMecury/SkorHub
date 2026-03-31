## 2025-05-14 - Parallelize Server-Side Data Fetching
**Learning:** Sequential `await` calls in Next.js Server Components create request waterfalls, increasing TTFB. `Promise.all` allows concurrent fetching, significantly reducing page load time.
**Action:** Always identify independent data fetches in Server Components and parallelize them using `Promise.all`.
