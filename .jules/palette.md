## 2025-05-15 - Accessible Combobox Pattern
**Learning:** To satisfy accessibility linting (jsx-a11y/role-has-required-aria-props) and provide a professional keyboard experience, an element with `role='combobox'` must include both `aria-controls` and `aria-expanded` attributes. Synchronizing `activeIndex` between `onMouseEnter` and keyboard events ensures a seamless transition between mouse and keyboard usage.
**Action:** Always implement `aria-activedescendant` on the input and `aria-selected` on the listbox options when building search dropdowns to ensure screen reader compatibility.
