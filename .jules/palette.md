## 2025-05-22 - Accessibility of Hover-Only Elements

**Learning:** Interactive elements hidden by default and shown only on hover (e.g., `opacity-0 group-hover:opacity-100`) are completely invisible and inaccessible to keyboard users unless they also include `focus-visible` states.

**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and ensure a clear focus indicator (like `focus-visible:ring-2`) is present for such elements.
