## 2026-02-14 - Improve accessibility and visibility of favorite buttons

**Learning:** Interactive elements hidden with `opacity-0` (for hover-only effects) are inaccessible to keyboard users because they remain hidden even when focused. Adding `focus-visible:opacity-100` ensures they become visible when the user tabs to them.

**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` for elements that should be accessible via keyboard. Ensure icon-only buttons have descriptive `aria-label` attributes.
