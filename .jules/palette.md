## 2025-05-17 - Keyboard Accessibility for Hover-only Elements

**Learning:** Interactive elements that are only revealed on hover (e.g., `opacity-0 group-hover:opacity-100`) are completely unreachable and invisible to keyboard-only users unless they also have `focus-visible` styles that force visibility and provide a focus indicator. Additionally, nesting buttons inside `Link` components is an accessibility violation that can be resolved by using styled `span` elements for the visual "button" while the parent `Link` handles the interaction.

**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` and a clear focus ring. Use semantic `span` or `div` for decorative/styled elements within interactive parents to avoid invalid nested button structures.
