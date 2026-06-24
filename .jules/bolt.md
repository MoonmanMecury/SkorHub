## 2026-06-24 - O(N*M) Filtering on Home Page
**Learning:** The "Upcoming & Recent" section previously filtered the full match list against the live match list using a nested `find` operation, resulting in (N \times M)$ complexity. Additionally, sequential `await` calls for data fetching created an unnecessary waterfall.
**Action:** Parallelize data fetching with `Promise.all` and use a `Set` for (1)$ lookups during filtering to achieve (N+M)$ linear complexity.
