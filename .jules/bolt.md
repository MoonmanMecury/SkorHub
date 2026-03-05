## 2025-03-05 - Redundant Side Effects in Global Hooks
**Learning:** Using hooks that perform side effects (like localStorage access or DB sync) in multiple high-density components (e.g., MatchCards in a grid) leads to redundant operations and potential race conditions. Centralizing this state in a Context Provider ensures side effects run once and state is consistent across the app.
**Action:** Lift state and side effects into a Provider when the same data/logic is consumed by many sibling components.

## 2025-03-05 - Algorithmic Optimization in Filter Loops
**Learning:** Using `.find()` or `.includes()` inside a `.filter()` on large lists creates an $O(N \times M)$ bottleneck. Converting the lookup list to a `Set` reduces this to $O(N + M)$.
**Action:** Always use a `Set` for lookups inside loops when dealing with large datasets.
