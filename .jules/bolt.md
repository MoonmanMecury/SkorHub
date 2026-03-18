## 2025-05-15 - [Data Fetching Parallelization]
**Learning:** Parallelizing data fetching with `Promise.all` in Server Components significantly reduces TTFB when multiple independent API calls are required.
**Action:** Always check for independent `await` calls and group them in `Promise.all`.

## 2025-05-15 - [O(N) List Filtering]
**Learning:** Using a `Set` for lookups during list filtering transforms O(N*M) operations into O(N+M), which is crucial for large data sets like match listings.
**Action:** Use `Set` for ID lookups when filtering one list by another.
