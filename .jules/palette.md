## 2025-05-24 - Accessible Hover Actions
**Learning:** Interactive elements (like favorite buttons) that use `group-hover` for visibility are inaccessible to keyboard and screen reader users if they remain hidden when the parent container is focused. Adding `focus-visible` classes to the element itself ensures it becomes visible when reached via keyboard navigation.
**Action:** Always combine `group-hover:opacity-100` with `focus-visible:opacity-100` and explicit focus rings for any interactive elements that are hidden by default in a card or list row.
