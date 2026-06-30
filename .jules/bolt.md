## 2026-06-30 - Home Page Performance Optimization
**Learning:** Sequential await calls for multiple independent data fetches (liveMatches, allMatches, sports) on the Home page create a cumulative latency bottleneck. Additionally, filtering large collections using O(N^2) nested loops (like `.filter(m => !liveMatches.find(l => l.id === m.id))`) significantly impacts server-side rendering time as the number of matches grows.
**Action:** Parallelize independent fetches using `Promise.all` and utilize `Set` for O(N) lookup complexity when filtering or deduplicating data in React components.
