## 2026-04-18 - Home page data fetching and filtering optimization
**Learning:** Sequential `await` calls in Server Components significantly increase TTFB by blocking the response until all requests finish. Additionally, $O(N \cdot M)$ nested loops for filtering lists (e.g., excluding live matches from upcoming matches) can be optimized using a `Set` for $O(1)$ lookups.
**Action:** Always use `Promise.all` for independent data fetches and prefer `Set` for ID-based filtering in list operations.
