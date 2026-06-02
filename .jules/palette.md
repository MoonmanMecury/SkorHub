## 2025-05-24 - Interactive elements hidden on hover
**Learning:** Interactive elements (like favorite buttons) that are hidden by default (`opacity-0`) and only shown on `group-hover` are inaccessible to keyboard users.
**Action:** Always include `group-focus-within:opacity-100` and `focus-visible:opacity-100` alongside hover styles to ensure visibility during keyboard navigation.
