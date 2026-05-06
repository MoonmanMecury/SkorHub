## 2025-05-15 - Improving Accessibility for Hover-only Actions

**Learning:** Interactive elements revealed only on hover (e.g., favorite buttons in cards) are invisible to keyboard users. Nested interactive elements (like a `<button>` inside an `<a>` or `Link`) are invalid HTML and confuse assistive technologies.

**Action:**
- Use `focus-visible:opacity-100` alongside `group-hover:opacity-100` to ensure keyboard discoverability.
- Add descriptive `aria-label` to icon-only buttons.
- Replace nested `<button>` elements inside links with styled `<span>` or `<div>` if they are purely visual, or move them outside the link if they require interaction.
