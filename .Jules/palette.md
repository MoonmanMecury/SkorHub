## 2026-03-23 - Focus Visibility for Hover-Only Elements
**Learning:** Elements that only appear on hover (like favorite buttons on cards) are completely inaccessible to keyboard and screen-reader users unless they are also triggered by focus.
**Action:** Use `group-focus-within:opacity-100` or `focus-visible:opacity-100` to ensure interactive elements are visible when their parent container or the element itself receives focus.
