## 2025-05-15 - Parallelizing Fetches in Server Components
**Learning:** Sequential `await` calls in Next.js Server Components create network waterfalls that increase TTFB. Using `Promise.all` can significantly reduce latency when data fetches are independent.
**Action:** Always check for independent `await` calls in Server Components and parallelize them using `Promise.all`.
