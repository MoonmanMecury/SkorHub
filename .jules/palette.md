## 2025-05-15 - Enhancing Keyboard Accessibility for Interactive Cards

**Learning:** Interactive elements nested within parent clickable areas (like `<Link>`) that are styled with `opacity-0` by default (e.g., favorite buttons) must explicitly implement `focus-visible:opacity-100` alongside hover states. Additionally, nested `<button>` elements within `<Link>` components are invalid HTML and cause issues with screen readers and keyboard navigation; they should be converted to styled `<span>` or similar non-interactive tags if they are purely decorative or part of the larger link's hit area.

**Action:** Always ensure that any hidden-on-idle interactive elements have `focus-visible` visibility states. Avoid nesting `<button>` or `<a>` tags inside each other; use CSS to style a `<span>` to look like a button when it's part of a parent link's visual feedback.
