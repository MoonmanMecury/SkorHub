## 2025-05-15 - [Redirect UX]
**Learning:** Using native `alert()` for redirection messages is disruptive and can be missed by screen readers or blocked by browsers. Replacing it with an in-UI countdown and `aria-live="polite"` provides a much smoother, more accessible transition that keeps the user in the context of the application.
**Action:** Always prefer in-UI feedback for state transitions and redirects over native browser dialogs.
