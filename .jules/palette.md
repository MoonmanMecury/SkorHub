## 2025-05-15 - [SearchBar Keyboard Navigation & A11y]
**Learning:** For a complete accessible search 'combobox' pattern, it is essential to use `aria-activedescendant` on the input pointing to the ID of the active `role="option"`. Additionally, performing modulo operations for index navigation requires a guard against empty arrays to prevent `NaN` states.
**Action:** Always implement a guard `if (results.length === 0) return` before keyboard navigation logic and ensure every `role="option"` has a unique ID for `aria-activedescendant` support.
