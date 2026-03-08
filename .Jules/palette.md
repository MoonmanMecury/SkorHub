## 2025-05-15 - Improving Card Accessibility and Keyboard Navigation

**Learning:** Nesting interactive elements like `<button>` inside a `<Link>` is invalid HTML and can confuse screen readers or break event propagation. Additionally, hidden interactive elements (e.g., `opacity-0` on hover) must be explicitly handled for keyboard users using `focus-visible`.

**Action:** Use `span` or `div` for decorative "actions" inside a link, and use `focus-visible:opacity-100` along with `group-focus-within` or direct focus rings to ensure keyboard users can interact with all UI elements.
