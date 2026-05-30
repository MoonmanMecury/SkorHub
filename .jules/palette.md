## 2026-05-30 - Accessible Non-Blocking Redirections
**Learning:** Replacing blocking native `alert()` with a custom UI improves UX flow but requires explicit ARIA attributes to maintain accessibility. Using `role="alert"` and `aria-live="polite"` ensures that the transition and countdown are still perceivable by screen reader users who would have otherwise been notified by the browser's native dialog.
**Action:** When implementing custom modal or interstitial states that replace native browser dialogs, always include appropriate ARIA roles and live regions.
