## 2025-05-14 - Avoiding Cascading Renders in Search State
**Learning:** Calling setState synchronously within a useEffect (e.g., resetting activeIndex when results change) triggers the `react-hooks/set-state-in-effect` lint error. This can lead to performance issues and unpredictable render cycles.
**Action:** Perform state resets within the primary logic that triggers the change (e.g., inside the search debounce timer) rather than in a separate synchronization effect.
