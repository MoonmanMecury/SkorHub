# Bolt's Performance Journal ⚡

## 2025-05-15 - Centralizing State in High-Density Components
**Learning:** In a high-density dashboard like this one, multiple components (EventCard, EventListRow, MatchClientWrapper) often need the same state (e.g., favorites). Having each instance of `useFavorites` manage its own state and side effects leads to redundant `localStorage` reads, `Set` creations, and API calls.
**Action:** Centralize shared state into a React Context Provider at the root. Use a `Set` for O(1) lookups instead of `.includes()` ($O(N)$) to significantly improve render performance when many items are displayed.
