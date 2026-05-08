# Palette's Journal

## 2025-05-14 - Accessible Hover-Only Elements
**Learning:** Interactive elements that are only visible on hover (like favorite buttons on cards) are inaccessible to keyboard users unless they also become visible on focus.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and ensure a clear focus ring (e.g., `focus-visible:ring-2`) is present.
