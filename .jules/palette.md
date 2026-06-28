## 2025-05-14 - Replacing Blocking Alerts with Visual Feedback
**Learning:** Using native browser `alert()` is jarring and blocks the main thread, leading to a poor UX. Replacing it with a themed, non-blocking visual countdown provides better feedback and control to the user.
**Action:** Always prefer on-page status messages or countdowns over native browser modals for redirection or informational alerts. Ensure interactive elements in these states (like manual override buttons) have proper `focus-visible` states for accessibility.
