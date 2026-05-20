## 2025-05-20 - Keyboard Accessibility for Hover-only Elements
**Learning:** Elements that are only visible on hover (like favorite buttons in card components) are completely unreachable for keyboard users if they don't have explicit focus states that also trigger their visibility.
**Action:** Always include `focus-visible:opacity-100` and a standard focus ring (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`) on elements with `opacity-0 group-hover:opacity-100`.
