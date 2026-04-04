## 2025-05-14 - Search Accessibility and Keyboard Navigation
**Learning:** Implementing the WAI-ARIA Combobox pattern in a search bar significantly improves accessibility for screen reader users and power users who prefer keyboard navigation. Specifically, syncing `onMouseEnter` with the `activeIndex` state prevents "jumpy" focus when switching between mouse and keyboard.
**Action:** Always include `role="combobox"`, `aria-activedescendant`, and keyboard listeners (`ArrowUp/Down`, `Enter`, `Escape`) for dropdown-based search components.
