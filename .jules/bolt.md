## 2025-05-14 - Parallelize I/O and Optimize List Filtering
**Learning:** Parallelizing data fetches in Next.js Server Components with `Promise.all` can significantly reduce TTFB. Additionally, replacing nested `.find()` or `.includes()` calls with a `Set` for lookups improves list processing performance from $O(N \cdot M)$ to $O(N + M)$.
**Action:** Always check for sequential `await` calls and nested loop lookups in data-heavy components.
