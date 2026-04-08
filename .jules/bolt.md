## 2025-05-15 - [Network Waterfalls & O(N) Filtering]
**Learning:** Sequential `await` calls in Next.js Server Components create network waterfalls that drastically increase Time to First Byte (TTFB). Parallelizing these with `Promise.all` can reduce load times by seconds. Additionally, using a `Set` for ID lookups during filtering transforms O(N*M) operations into O(N), which is critical for scaling.
**Action:** Always check for independent `await` calls in Server Components and use `Promise.all`. Audit filter logic for potential nested loops that can be optimized with hash maps or sets.
