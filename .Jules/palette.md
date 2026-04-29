## 2025-05-14 - Improved Redirection UX and Accessibility
**Learning:** Replacing blocking `window.alert()` with a themed, non-blocking UI improves user flow and allows for better feedback (countdown) and manual overrides. Adding `aria-label` to icon-only buttons is critical for screen reader support.
**Action:** Always prefer custom UI notices over native browser alerts for redirects. Ensure all icon-only interactive elements have descriptive accessible names.
