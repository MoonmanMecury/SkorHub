## 2025-01-24 - Material Symbols and Keyboard Accessibility

**Learning:** Material Symbols (variable fonts) require `font-variation-settings: 'FILL' 1` to render the "filled" state; CSS `fill` or standard font weights do not work. Additionally, interactive elements hidden with `opacity-0` for "hover-only" effects are inaccessible to keyboard users unless they include `focus-visible:opacity-100` and appropriate transform resets.

**Action:** Use inline styles for `fontVariationSettings` when toggling icon states and ensure all hover-triggered UI elements are also triggered by `focus-visible` to maintain WCAG compliance.
