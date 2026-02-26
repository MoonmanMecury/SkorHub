## 2026-02-26 - Improving Favorite Button Accessibility
**Learning:** Icon-only buttons that are hidden until hover (`opacity-0`) are common but problematic for keyboard accessibility. They must be visible on `focus-visible` and should have ARIA labels. Additionally, font-based icons (like Material Symbols) require `font-variation-settings` for visual states like "FILL", which can be easily missed.
**Action:** Use `focus-visible:opacity-100` and `aria-label` for all icon-only buttons. Ensure font-based icon states are correctly toggled.
