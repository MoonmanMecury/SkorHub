## 2025-05-14 - Parallelize data fetching in Home page
**Learning:** Sequential `await` calls in Next.js Server Components create waterfalls that increase TTFB unnecessarily. Parallelizing independent requests with `Promise.all` can significantly reduce the initial response time.
**Action:** Always check for independent `await` calls in Server Components and use `Promise.all` where possible.
