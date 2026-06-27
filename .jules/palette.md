## 2025-06-27 - Search Results Accessibility
**Learning:** Adding `aria-label` to buttons that contain dynamic text content (like search results with live status, scores, etc.) can cause screen readers to ignore the internal content, leading to a loss of information for visually impaired users.
**Action:** Avoid using `aria-label` on complex interactive elements that already contain meaningful text. Use `aria-live` on the container to announce updates instead.
