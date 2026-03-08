## 2025-05-15 - Optimizing Sequential Waterfalls and $O(N \times M)$ Filtering

**Learning:** In Next.js App Router, multiple sequential `await` calls in Server Components create a request waterfall that significantly increases TTFB. Additionally, filtering large lists using `.find()` or `.some()` inside a `.filter()` loop results in $O(N \times M)$ complexity, which can noticeably degrade performance as the data size grows.

**Action:** Always use `Promise.all` to parallelize data fetching when fetches are independent. For list filtering involving ID comparisons, use a `Set` to reduce complexity to $O(N)$. For sport-specific pages, use granular API endpoints like `getMatchesBySport(id)` instead of fetching the entire match list and filtering client-side.
