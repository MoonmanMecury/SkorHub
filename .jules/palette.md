## 2025-05-15 - Improving Keyboard Accessibility for "Hover-Only" Elements
**Learning:** Interactive elements that are styled with `opacity-0` by default (e.g., favorite buttons that appear on hover) are completely inaccessible to keyboard users unless they also implement `focus-visible` states to become visible and receive a focus indicator.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and ensure a clear `focus-visible:ring` or similar indicator is present for accessibility.
