## 2026-04-18 - Enhanced SearchBar Accessibility
**Learning:** Implementing the ARIA combobox pattern requires careful synchronization of `aria-activedescendant` and stable IDs. Using `useId` to prefix option IDs prevents collisions when multiple instances exist.
**Action:** Always use stable, unique IDs for listbox options and ensure focus states are visually distinct.
