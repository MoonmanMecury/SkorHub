## 2025-05-03 - Improved Redirection UX & Accessibility
**Learning:** Replacing blocking `window.alert()` with an in-app non-blocking notice card significantly improves user flow and visual consistency. Interactive elements that appear on hover (like favorite buttons) are inaccessible to keyboard users unless they have `focus-visible` styles to trigger their visibility when tabbed to.
**Action:** Always prefer styled non-blocking UI for feedback over native browser alerts. Ensure all icon-only or hover-revealed buttons have `aria-label` and `focus-visible` states.
