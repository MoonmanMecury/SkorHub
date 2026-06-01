## 2025-06-01 - [Redirect UX Enhancement]
**Learning:** Browser native `alert()` is disruptive for redirection flows and lacks accessibility context. A custom countdown UI provides better feedback, preserves user agency with "Redirect Now" buttons, and allows for proper ARIA labeling.
**Action:** Replace blocking browser alerts with non-blocking countdown components and ensure `role="alert"` and `aria-live="polite"` are used for screen reader announcements.
