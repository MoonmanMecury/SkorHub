## 2026-05-01 - [Accessibility for hover-only interactive elements]
**Learning:** Interactive elements that are visually hidden until hover (e.g., using `opacity-0 group-hover:opacity-100`) are invisible to keyboard users and lack context for screen readers if they don't have focus states or ARIA labels.
**Action:** When using hover-to-reveal patterns, always include `focus-visible:opacity-100` and clear `aria-label` attributes to ensure the element is discoverable and usable by all users.
