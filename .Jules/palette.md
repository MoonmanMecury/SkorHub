## 2025-05-15 - [Non-blocking Redirection]
**Learning:** Browser-native `alert()` calls are disruptive, break application immersion, and are poor for accessibility as they block the main thread and can be missed by screen readers if not handled carefully. Replacing them with themed, non-blocking UI components with automatic countdowns improves user flow and provides better context and control.
**Action:** Always prefer custom UI components over native browser dialogs like `alert()` or `confirm()` to maintain design consistency and improve accessibility with `aria-live`.
