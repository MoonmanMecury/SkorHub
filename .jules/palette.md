## 2025-05-15 - Improving Accessibility for Hover-Only Elements
**Learning:** Elements hidden with `opacity-0` and only shown on `:hover` are inaccessible to keyboard users unless they also receive `focus-visible` styles that restore opacity.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` for interactive elements within a group.

## 2025-05-15 - Fixing Invalid Interactive Nesting
**Learning:** Nesting a `<button>` inside a Next.js `<Link>` (which renders an `<a>`) is invalid HTML and confuses screen readers.
**Action:** Replace nested interactive elements with styled `<span>` or `<div>` tags if they are purely visual, or refactor to avoid nesting.
