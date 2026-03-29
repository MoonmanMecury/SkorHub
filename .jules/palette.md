# Palette Journal 🎨

Critical UX/accessibility learnings for SkorHub.

## 2026-03-29 - Keyboard Visibility for Hidden Actions
**Learning:** Interactive elements hidden by default (e.g., 'opacity-0' on cards) must be made visible on focus using 'focus-visible:opacity-100' or 'group-focus-within:opacity-100' to ensure keyboard accessibility.
**Action:** Always include 'focus-visible:opacity-100' when using hover-to-show patterns for buttons.
