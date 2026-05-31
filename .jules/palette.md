## 2025-05-15 - Improving Keyboard Discoverability for Hover-Only Actions

**Learning:** Interactive elements that use `opacity-0` or are otherwise visually hidden by default (often used for "actions on hover" patterns in cards) are inaccessible to keyboard users unless explicitly handled. Standard CSS `hover:opacity-100` does not trigger on focus.

**Action:** Always pair `hover:opacity-100` with `focus-visible:opacity-100` and appropriate focus indicators (like `ring`) for elements hidden by default. This ensures that when a user tabs into the element, it becomes visible and its focus state is clear. Additionally, always verify that interactive elements are not nested (e.g., `<button>` inside `<Link>`), as this is invalid HTML and breaks screen reader behavior.
