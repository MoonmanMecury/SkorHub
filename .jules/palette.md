## 2025-05-15 - [Interactive element nesting]
**Learning:** Nesting interactive elements (like a `<button>` inside a `<Link>`) is an accessibility violation that breaks keyboard navigation and causes inconsistent screen reader behavior. It is also invalid HTML.
**Action:** When adding interaction to an existing link, use styled `<span>` or other non-interactive tags for visual elements and place the `onClick` or secondary interaction outside the main link if possible, or use absolute positioning to avoid nesting.

## 2025-05-15 - [Focus visibility for hover-only elements]
**Learning:** Elements that only appear on hover (like favorite buttons on cards) are inaccessible to keyboard users unless explicitly handled with `focus-visible`.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and ensure the element has a clear focus ring to provide feedback to keyboard-only users.
