## 2026-05-05 - [Redundant Hook Effects]
**Learning:** The `useFavorites` hook is used extensively in match list components (`MatchCard`, `EventCard`, etc.). Since each instance manages its own state and effects, rendering a large list of matches (e.g., the home page) triggers dozens of independent `useEffect` calls that read from `localStorage` and potentially sync with the DB.
**Action:** Future performance work should focus on moving favorite state to a centralized `FavoritesProvider` to ensure a single source of truth and reduce the overhead of redundant effects across many components.
