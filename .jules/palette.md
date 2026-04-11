## 2026-04-11 - SearchBar Keyboard Navigation & Linting
**Learning:** When implementing keyboard navigation in a dropdown, resetting the active index in a separate `useEffect` triggers `react-hooks/set-state-in-effect` lint warnings. It is better to reset the index within the same asynchronous block that updates the results.
**Action:** Always bundle state resets with the primary state update in async handlers to avoid cascading renders and lint errors.
