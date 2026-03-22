## 2024-05-23 - Centralized state management for favorites
**Learning:** Independent state management in a widely used hook (`useFavorites`) led to redundant API calls and `localStorage` operations across multiple components. Centralizing this state in a context provider ensures only one source of truth and a single initialization fetch. Using a `Set` for lookups improves performance from $O(n)$ to $O(1)$.
**Action:** Always consider centralizing frequently used data that syncs with an external store (DB/localStorage) to minimize redundant operations and ensure state consistency.
