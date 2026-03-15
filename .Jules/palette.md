## 2026-03-15 - Improving Favorite Buttons and Search Accessibility

**Learning:** Interactive elements hidden behind `group-hover` (like favorite buttons on cards) are completely inaccessible to keyboard users unless they also have `focus-visible` visibility classes. Additionally, Material Symbols require `font-variation-settings: 'FILL' 1` to show a solid state; standard CSS `fill` often doesn't work for these icon fonts.

**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and ensure a clear focus ring. Use the `style` prop with `fontVariationSettings` for Material Symbols state changes.

**Learning:** A search bar with a dropdown results list is not truly accessible without keyboard navigation (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`) and proper ARIA wiring (`role="combobox"`, `aria-activedescendant`, `aria-selected`).

**Action:** Implement a selection index state for search results and sync it with `aria-activedescendant` on the input to provide screen reader feedback during navigation.
