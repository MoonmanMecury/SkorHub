# Bolt's Performance Journal

## 2025-05-15 - Targeted API vs Generic Fetching
**Learning:** Using targeted API endpoints like `getMatchesBySport` is significantly more efficient than fetching a large dataset and filtering in memory, especially when combined with `Promise.all` to resolve waterfalls. Parallelizing independent API requests can reduce page TTFB by up to 50% by avoiding sequential blocking.
**Action:** Always check if a targeted API exists before resorting to manual filtering of global datasets. Use `Promise.all` for independent data fetching operations.
