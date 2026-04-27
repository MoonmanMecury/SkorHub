## 2026-04-18 - Improve MatchCard favorite button accessibility
**Learning:** Icon-only buttons that appear on hover are completely inaccessible to keyboard and screen reader users if they don't have an ARIA label and don't become visible on focus.
**Action:** Always add descriptive `aria-label` and ensure `focus-visible` states make hidden elements visible (e.g., `focus-visible:opacity-100`).
