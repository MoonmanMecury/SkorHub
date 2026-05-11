## 2025-05-15 - Interactive Element Accessibility
**Learning:** Icon-only buttons and hover-revealed elements (like favorite stars) are invisible to keyboard users and screen readers if they lack ARIA labels and explicit focus states. Additionally, nesting buttons inside Links is a common pattern that breaks HTML validity and accessibility.
**Action:** Always add `aria-label` to icon-only buttons, ensure `focus-visible:opacity-100` for hover-only elements, and use styled `span` instead of `button` when visual buttons are needed inside a `Link`.
