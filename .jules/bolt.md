## 2025-05-15 - Parallel Data Fetching & Efficient Filtering
**Learning:** Sequential data fetching in Next.js Server Components creates avoidable waterfalls. Using `Promise.all` can significantly reduce TTLB. Additionally, $O(N \times M)$ filtering logic in list rendering (e.g., `filter(m => !live.some(l => l.id === m.id))`) can be optimized to $O(N + M)$ using a `Set`.
**Action:** Always audit for waterfalls in `page.tsx` and prefer `Set` for ID-based lookups in filters.
