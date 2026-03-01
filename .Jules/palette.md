## 2025-05-15 - Improving redirection UX
**Learning:** Avoid using native JavaScript 'alert()' for redirects or critical feedback; instead, display the message within the UI and use a short delay (e.g., 2000-3000ms) before navigating. This provides a more integrated and less disruptive experience. Also, using 'role="status"' and 'aria-live="polite"' ensures accessibility for screen readers.
**Action:** Replace blocking alerts with themed UI notifications and timed redirects.
