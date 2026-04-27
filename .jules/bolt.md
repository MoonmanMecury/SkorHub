## 2026-04-18 - Optimized Match Fetching and Filtering
**Learning:** Sequential await calls in Next.js Server Components create a waterfall that increases TTFB. Parallelizing these fetches with Promise.all can significantly reduce latency. Additionally, using a Set for O(1) lookups is much more efficient than nested O(N*M) array searches (like .find inside .filter).
**Action:** Always look for opportunities to use Promise.all for independent server-side fetches and prefer Sets/Maps for frequent lookups in large data sets.
