## 2025-05-14 - Accessibility & HTML Validity Regressions in Match Lists

**Learning:** Hover-only interactive elements (like favorite stars) are frequently missing `aria-label` and `focus-visible` states, making them invisible and unusable for keyboard/screen-reader users. Additionally, nesting `<button>` elements inside Next.js `<Link>` components is a common HTML validity regression that can cause unexpected click behavior and hydration mismatches.

**Action:** Always verify that every icon-only button has a descriptive `aria-label`. Ensure that elements hidden with `opacity-0` or `scale-0` on hover have corresponding `focus-visible:opacity-100` and `focus-visible:scale-100` states. Replace nested `<button>` tags within `<Link>` with styled `<span>` or `<div>` elements.
