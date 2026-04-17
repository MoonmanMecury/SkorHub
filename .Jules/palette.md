## 2025-05-14 - SearchBar Keyboard Navigation and Accessibility
**Learning:** Implementing a keyboard-accessible combobox pattern requires synchronizing `activeIndex` with result changes to avoid "stale" highlights. Using `onMouseEnter` to sync `activeIndex` provides a more intuitive transition between mouse and keyboard usage.
**Action:** Always include ARIA attributes (`role="combobox"`, `aria-activedescendant`) and ensure the active index is reset when the dataset changes to maintain accessibility.
