## 2025-05-15 - Improving Redirect Immersion
**Learning:** Browser-native `alert()` calls are jarring, block the main thread, and provide poor feedback for timed operations like redirections. Replacing them with themed, non-blocking UI components improves application immersion and allows for manual overrides.
**Action:** Always prefer custom UI over native dialogs for status updates or timed redirections. Ensure timed redirects include a visual progress indicator and a clear way for users to trigger or cancel the action.
