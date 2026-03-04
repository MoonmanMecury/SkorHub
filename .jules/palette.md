## 2025-05-14 - Accessible Hover-Only Actions

**Learning:** Interactive elements hidden with `opacity-0` (e.g., favorite buttons shown only on card hover) are unreachable or invisible to keyboard users unless explicitly handled. Nested interactive elements (like `<button>` inside `<Link>`) are invalid HTML and break screen reader expectations.

**Action:** Always include `focus-visible:opacity-100` and clear `aria-label` attributes on hover-only actions. Replace nested buttons within links with styled `<span>` or `<div>` to maintain valid document structure while preserving visual design.
