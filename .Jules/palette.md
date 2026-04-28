## 2026-04-18 - Improved Redirect Experience
**Learning:** Using `window.alert()` in modern SPAs is highly disruptive as it blocks the main thread and feels outdated. Replacing it with a themed, non-blocking UI component that includes a countdown and manual fallback significantly improves the "flow" and perceived quality of the application.
**Action:** Always prefer non-blocking UI notifications or dedicated redirect pages over native browser alerts for redirection messages.
