## 2025-05-15 - Replacing Blocking Browser Alerts

**Learning:** Browser native `alert()` calls are blocking and provide a poor user experience as they freeze the main thread and feel disconnected from the app's design system. Replacing them with non-blocking, timed visual feedback improves flow and maintainability.

**Action:** Prefer custom UI components with countdowns and manual overrides over native `alert()` or `confirm()` for non-critical notifications.
