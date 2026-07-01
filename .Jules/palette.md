## 2026-07-01 - [RedirectAlert UX Enhancement]
**Learning:** Replacing blocking `alert()` calls with themed visual countdowns significantly improves the user experience and maintain visual continuity. Adding `role="alert"` and `aria-live="polite"` ensures these asynchronous redirects are accessible.
**Action:** Always prefer non-blocking, accessible UI elements over native browser dialogs for informative or timed actions.
