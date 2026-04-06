## 2025-05-14 - Accessible Search Combobox
**Learning:** Standardizing search bars with WAI-ARIA Combobox patterns significantly improves the experience for screen reader users and power users who rely on keyboard navigation. Adding a distinct visual indicator (e.g., border-left and background tint) for the active keyboard state ensures that the "focus" is clear and distinguishable from regular hover states.
**Action:** Always implement `aria-activedescendant` and `role="listbox"` for dropdown search results, and ensure a clear visual distinction for the keyboard-active item.
