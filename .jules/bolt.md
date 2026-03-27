# Bolt's Performance Journal

## 2025-05-15 - Optimizing Server Component Data Fetching
**Learning:** In Next.js Server Components, sequential `await` calls for independent data sources create a request waterfall, increasing Time to First Byte (TTFB). Additionally, fetching a global dataset (e.g., `getAllMatches`) and filtering it on the server when a targeted API endpoint (e.g., `getMatchesBySport`) exists is inefficient in terms of memory and processing.
**Action:** Use `Promise.all` to parallelize independent fetches in Server Components. Prefer targeted API endpoints over global fetches with manual filtering to reduce payload size and processing overhead.
