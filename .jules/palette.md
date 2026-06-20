## 2025-05-14 - Fixing Invalid HTML Nesting in List Components

**Learning:** Interactive elements like `<button>` nested inside Next.js `<Link>` (anchor) tags create invalid HTML and can disrupt screen reader behavior. This often happens when trying to add "Watch" or "Action" indicators to a clickable list row.

**Action:** Replace nested presentational `<button>` elements with `<span>` while maintaining the same CSS classes. This preserves the visual design without violating HTML specifications or confusing assistive technologies. If the inner element requires its own click handler, it should be moved outside the link or handled via event delegation/absolute positioning with proper z-indexing.
