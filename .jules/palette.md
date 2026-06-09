## 2026-06-09 - Custom Redirect UI vs Native Alert
**Learning:** Using native `alert()` for redirections (e.g., "Match ended, redirecting...") is intrusive and blocks the main thread, preventing the underlying page from rendering. A custom UI with a visible countdown provides much better feedback and allows users to skip the wait with a "Redirect Now" button.
**Action:** Always prefer non-blocking custom components with countdowns for automated navigation events to maintain user agency and visual continuity.
