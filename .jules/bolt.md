# Bolt's Performance Journal

## 2026-06-03 - Parallelize Data Fetching on Home Page
**Learning:** Sequential `await` calls in Server Components create a network waterfall that significantly increases Time to First Byte (TTFB). In this codebase, the Home page was fetching live matches, all matches, and sports categories sequentially, even though they are independent.
**Action:** Use `Promise.all` to fetch independent data concurrently in Server Components. This reduces total fetch time to the duration of the slowest request rather than the sum of all requests.

## 2026-06-03 - Targeted vs. Generic Data Fetching
**Learning:** Fetching the entire dataset (`getAllMatches`) and filtering locally for a specific sport is significantly slower than using a targeted API endpoint (`getMatchesBySport(id)`), especially as the dataset grows.
**Action:** Prioritize specific API endpoints over generic "fetch all and filter" patterns. Always check if the API supports targeted queries before resorting to local filtering.
