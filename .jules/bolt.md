# Bolt Performance Journal

## 2025-05-14 - Parallelized Data Fetching and Set-based Filtering
**Learning:** Sequential await calls in Next.js Server Components create waterfalls that increase TFB (Time to First Byte). O(N*M) filtering logic in render blocks can be optimized to O(N+M) using Sets for O(1) lookups.
**Action:** Always use Promise.all for independent data fetches and utilize Sets for efficient cross-referencing of large lists.
