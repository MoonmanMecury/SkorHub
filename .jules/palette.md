## 2026-05-26 - Accessible Favorite Buttons
**Learning:** Interactive elements hidden by default (opacity-0) and triggered only by `group-hover` are inaccessible to keyboard and screen reader users. They require explicit focus-visible styles and focus-within visibility logic.
**Action:** Always use `group-focus-within:opacity-100` and `focus-visible` classes alongside hover-based visibility, and provide semantic `aria-label` attributes for icon-only buttons.
