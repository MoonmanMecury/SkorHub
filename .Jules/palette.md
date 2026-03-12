## 2025-05-15 - Interactive Elements Accessibility & Material Symbols

**Learning:** Interactive elements that only appear on hover (opacity-0) are completely inaccessible to keyboard users and screen readers unless they also include focus-visible states. Additionally, Material Symbols require explicit font-variation-settings for the 'FILL' state, as CSS 'fill' properties do not affect them.

**Action:** Always include 'focus-visible:opacity-100' on hover-only elements. Ensure icon-only buttons have 'aria-label' and 'aria-pressed' attributes. Use 'fontVariationSettings' for toggling Material Symbol states.
