## 2026-06-10 - Ensuring hover-only interactive elements are accessible via focus states
**Learning:** Interactive elements hidden by default and shown only on hover (e.g., `opacity-0 group-hover:opacity-100`) must also include `focus-visible:opacity-100` and a clear focus ring to ensure accessibility for keyboard users.
**Action:** Always combine `group-hover:opacity-100` with `focus-visible:opacity-100` and add appropriate focus rings to elements that are only visible on interaction.
