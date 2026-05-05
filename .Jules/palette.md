## 2025-05-14 - Non-blocking Redirect UI
**Learning:** Using `window.alert()` for redirection is a disruptive UX anti-pattern that blocks the main thread and feels "legacy". A custom countdown UI with a manual override ("Go Now") provides a much smoother, branded, and accessible transition.
**Action:** Replace browser-native blocking alerts with state-managed countdown components for all redirection flows.
