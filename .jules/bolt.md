## 2025-05-14 - Parallelize Data Fetching on Home and Category Pages

**Learning:** Sequential `await` calls in Next.js Server Components create unnecessary request waterfalls, significantly increasing TTFB. For pages fetching multiple independent data sets (e.g., live matches, all matches, sports list), `Promise.all` can reduce the data fetching phase to the duration of the slowest request.

**Action:** Always look for independent `await` calls in Server Components and parallelize them using `Promise.all`. Additionally, use targeted API endpoints (like `getMatchesBySport`) instead of fetching all data and filtering locally to reduce payload size and processing time.
