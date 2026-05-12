## 2025-05-12 - [A11y] Hover-only Interactive Elements
**Learning:** Components using `opacity-0 group-hover:opacity-100` for interactive elements (like favorite buttons) make them unreachable for keyboard users unless explicitly paired with `focus-visible:opacity-100` and a clear focus ring.
**Action:** Always include `focus-visible:opacity-100` and `focus-visible:ring-2` on any element that relies on hover for visibility.
