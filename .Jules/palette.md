## 2025-05-22 - Replacing native alerts with themed redirects
**Learning:** Native `alert()` calls are jarring, block the UI thread, and feel disconnected from modern web applications. They also lack accessibility features and consistent styling.
**Action:** Use a dedicated interstitial component for redirects that includes a clear message, a countdown, and a "skip" button, all while being properly announced to screen readers via ARIA roles.
