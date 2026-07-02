## 2026-07-02 - Accessible Hover-Only Elements
**Learning:** Interactive elements that are only visible on hover (e.g., `opacity-0 group-hover:opacity-100`) are completely inaccessible to keyboard users unless they also implement `focus-visible:opacity-100`. Without this, the element remains invisible even when it has focus.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` for interactive elements that are hidden by default. Also ensure they have proper ARIA labels and focus indicators.
