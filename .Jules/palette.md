## 2026-05-15 - [Icon-only Button Accessibility]
**Learning:** Icon-only buttons (like favorite toggles) that are hidden until hover are inaccessible to keyboard users and screen readers. Material Symbols require 'font-variation-settings' for state changes (like 'FILL').
**Action:** Use 'aria-label' for screen readers, 'title' for tooltips, and 'focus-visible:opacity-100' to ensure visibility during keyboard navigation. Use 'fontVariationSettings' for Material Symbol state changes.

## 2026-05-15 - [Semantic HTML: No Nested Interactives]
**Learning:** Nesting a <button> inside a <Link> is invalid HTML and causes issues with focus management and assistive technologies.
**Action:** Replace nested buttons with styled <span> or <div> elements when they are purely visual/decorative within a link, or use separate sibling elements.
