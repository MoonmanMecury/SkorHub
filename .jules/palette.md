## 2025-05-22 - SearchBar Keyboard Navigation & ARIA
**Learning:** Standard keyboard interaction patterns (ArrowUp/Down, Enter, Esc) combined with appropriate ARIA roles (combobox, listbox, option) are essential for making search features accessible to screen readers and power users.
**Action:** Always implement a keyboard-accessible combobox pattern for search/autocomplete components, ensuring focus-visible states and clear ARIA relationships.

## 2025-05-22 - Favorite & Quality Button Accessibility
**Learning:** Icon-only buttons and hover-only interactive elements require explicit ARIA labels and focus-visible styles to be usable by keyboard and screen reader users.
**Action:** Ensure all icon buttons have aria-labels and use focus-visible:opacity-100 for elements that are normally hidden until hover.
