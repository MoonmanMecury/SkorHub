## 2025-05-14 - Non-blocking Redirect UX
**Learning:** Using `window.alert()` for redirection notices is disruptive as it blocks the main thread and provides a poor user experience. A non-blocking, timed UI component allows users to read the information while maintaining the flow of the application.
**Action:** Always prefer custom, non-blocking UI components with clear countdowns for automatic actions like redirection, and ensure they are accessible via ARIA roles.
