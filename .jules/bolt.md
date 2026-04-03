## 2025-05-14 - Parallelize Data Fetching in Next.js Server Components
**Learning:** Sequential `await` calls in Next.js Server Components create unnecessary request waterfalls, delaying Time to First Byte (TTFB).
**Action:** Always use `Promise.all` for independent data fetches to execute them in parallel and improve performance.

## 2025-05-14 - Efficient API Selection
**Learning:** Using a specific API endpoint (e.g., `getMatchesBySport`) is significantly more efficient than fetching all records and filtering them in-memory.
**Action:** Check API definitions for specialized endpoints before defaulting to manual filtering of large data sets.
