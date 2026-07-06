## 2026-07-06 - Replacing Native Alerts with UI Countdowns
**Learning:** Replacing native `alert()` calls with a non-blocking UI countdown improves UX flow by providing visual feedback without interrupting the user's interaction model. Using `role="alert"` and `aria-live="polite"` ensures these transitions are accessible to screen readers.
**Action:** Always prefer custom UI feedback over native browser dialogs (alert, confirm, prompt) to maintain branding and prevent modal-blocking of the UI thread.
