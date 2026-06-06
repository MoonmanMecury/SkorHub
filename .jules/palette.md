## 2026-06-06 - Enhanced Accessibility for Icon-Only Buttons
**Learning:** Icon-only buttons that are visually hidden until hover (e.g., `opacity-0 group-hover:opacity-100`) are completely inaccessible to keyboard users unless they also have `focus-visible` styles that restore visibility and provide a clear focus indicator.
**Action:** Always include `focus-visible:opacity-100` and `focus-visible:ring-2` (or similar focus rings) when using the "show on hover" pattern for interactive elements.
