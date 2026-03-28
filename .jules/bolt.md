## 2025-05-22 - Parallel Data Fetching in Server Components
**Learning:** Sequential `await` calls in Next.js Server Components create a request waterfall that significantly increases TTFB. Using `Promise.all` allows the server to fetch data concurrently, improving performance.
**Action:** Always parallelize independent data fetches in Server Components using `Promise.all`.

## 2025-05-22 - Global Favorites State with Context
**Learning:** Managing favorites state individually in each `EventCard` lead to redundant API calls and localStorage hits. Centralizing this state in a `FavoritesProvider` and using a `Set` for O(1) lookups is much more efficient.
**Action:** Use React Context for shared state like favorites and implement efficient lookup structures for large lists.
