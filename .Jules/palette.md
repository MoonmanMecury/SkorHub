# Palette Journal

## 2026-04-22 - Search Accessibility & Keyboard Navigation
**Learning:** For interactive search components, simply showing results is not enough for a good UX. Implementing the WAI-ARIA combobox pattern ensures that screen reader users can understand the relationship between the input and the results. Additionally, keyboard navigation (ArrowUp/Down, Enter, Escape) provides a "pro" feel and is essential for accessibility.
**Action:** Always implement the combobox pattern for search inputs with dropdown results, including `aria-activedescendant` for managing focus without moving the browser's focus from the input.
