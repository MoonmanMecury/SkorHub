# Palette Journal

This journal tracks critical UX and accessibility learnings.

## 2025-05-19 - Standardizing Match Card Accessibility
**Learning:** Interactive elements in this app (like favorite buttons) were often hidden with `opacity-0` and only revealed on hover via `group-hover:opacity-100`. This pattern makes them unreachable or invisible for keyboard-only users who rely on the `Tab` key.
**Action:** When using hover-only controls, always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and ensure a clear focus ring (`focus-visible:ring-2`) is present to maintain accessibility without compromising the "minimalist" hover-reveal design.
