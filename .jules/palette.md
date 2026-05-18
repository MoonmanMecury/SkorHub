## 2025-05-18 - [Accessibility improvements for match components]
**Learning:** Nested interactive elements (like a `<button>` inside a `<Link>`) are invalid HTML and cause confusion for screen readers. Additionally, elements hidden with `opacity-0` but revealed on hover must be explicitly made visible on focus (`focus-visible:opacity-100`) to be reachable for keyboard-only users.
**Action:** Always verify if a button is nested within a link and replace it with a styled `<span>` if necessary. Ensure `focus-visible` states are correctly applied to all interactive elements revealed on hover.
