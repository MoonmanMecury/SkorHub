## 2026-06-12 - Non-blocking Redirection
**Learning:** Using blocking browser `alert()` for navigation logic is a jarring UX pattern that halts the application state and prevents background tasks (like countdowns) from appearing.
**Action:** Replace `alert()` with a custom countdown UI and a manual override button to provide visual feedback and user agency during redirections.
