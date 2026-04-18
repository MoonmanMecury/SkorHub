## 2026-04-18 - Non-blocking Redirect Interface
**Learning:** Replacing blocking `window.alert()` with a timed, informative redirect UI significantly improves UX by preventing interaction interruption and providing clear context for the navigation.
**Action:** Use the `RedirectAlert` component for all automatic redirections, ensuring a 2-3 second delay and a manual fallback link for accessibility.
