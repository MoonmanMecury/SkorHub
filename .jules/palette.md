## 2026-04-02 - Accessible Search Navigation
**Learning:** For accessible search 'combobox' patterns, apply `role="combobox"`, `aria-autocomplete="list"`, and `aria-activedescendant` (referencing the active option's ID) to the input, while the results list should have `role="listbox"` and items `role="option"`. Synchronizing `onMouseEnter` with the active index ensures a seamless transition between mouse and keyboard navigation.
**Action:** Use this pattern for all dropdown-based selection components to ensure they are screen-reader friendly and keyboard navigable.
