## 2025-05-15 - [Improving Redirect UX]
**Learning:** Replacing blocking native `alert()` calls with a visual, stateful countdown UI significantly improves user flow and brand consistency. It also allows for the inclusion of a manual override ("Redirect Now"), which respects user agency.
**Action:** Always prefer non-blocking, themed UI feedback over native browser dialogs. Ensure these custom components implement `role="alert"` and `aria-live="polite"` for screen reader accessibility.

**Learning:** When using timers for navigation side effects in React, execute the navigation in a dedicated `useEffect` reacting to the state change (e.g., `seconds === 0`) rather than inside the `setInterval` callback to ensure consistent state management and avoid potential race conditions with concurrent renders.
**Action:** Use a "terminal state" check in a separate effect for navigation logic.
