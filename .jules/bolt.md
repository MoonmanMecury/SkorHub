## 2025-05-14 - Parallelize Server Component Fetches
**Learning:** Sequential awaits in Next.js Server Components block the TTFB. Even if individual API calls are fast, they stack up.
**Action:** Always use `Promise.all` for independent data fetches in Server Components.

## 2025-05-14 - Set for Efficient Lookups
**Learning:** Nested `.find` or `.includes` within a `.filter` creates O(N*M) complexity which is noticeable on large lists.
**Action:** Convert the lookup array into a `Set` before filtering to achieve O(N) complexity.
