## 2025-05-14 - Interactive elements on hover

**Learning:** Interactive elements revealed only on hover (e.g., using `opacity-0 group-hover:opacity-100`) must be paired with `focus-visible:opacity-100` and a clear focus ring to prevent being unreachable by keyboard-only users.

**Action:** Always ensure that any element hidden via opacity or translate on hover is explicitly made visible and identifiable when focused, using `focus-visible` utility classes and descriptive `aria-label` attributes.
