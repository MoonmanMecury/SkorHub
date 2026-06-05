## 2026-06-05 - Semantic HTML and Keyboard Visibility
**Learning:** Nesting interactive elements like `<button>` inside `<Link>` (which is an `<a>`) is invalid HTML and can confuse screen readers. Additionally, elements that are hidden by default with `opacity-0` (common for "hover-only" UI) must be made visible on focus (e.g., using `focus-visible:opacity-100`) to be accessible to keyboard users.
**Action:** Always verify that interactive elements are not nested. When using hover-only controls, ensure they have a `focus-visible` state that makes them visible and identifiable.
