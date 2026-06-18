## 2025-05-15 - Enhanced Redirect UX and Button Accessibility
**Learning:** Icon-only buttons that are only visible on hover must implement 'focus-visible:opacity-100' to be accessible to keyboard users. Also, native browser alert() in RedirectAlert was a major UX bottleneck that blocked the main thread and looked unprofessional.
**Action:** Always ensure hover-triggered elements have focus-visible counterparts and replace blocking native alerts with non-blocking, state-based countdown UIs.
