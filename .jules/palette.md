## 2026-06-22 - Improving Keyboard Accessibility for Hidden Interactive Elements
**Learning:** Hover-only interactive elements (like the favorite stars in this app) are completely inaccessible to keyboard users unless they also implement `focus-visible` states that force visibility. Standardizing `aria-label` across these elements is also critical for screen reader context when multiple identical icons (stars) exist on a page.
**Action:** Always implement `focus-visible:opacity-100` and `focus-visible:ring-2` on elements that use `opacity-0` for hover-only states.
