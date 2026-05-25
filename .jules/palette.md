## 2025-05-15 - Interactive Element Visibility & Nesting
**Learning:** Interactive elements (like favorite buttons) that use `group-hover` for visibility must also implement `focus-visible` or `group-focus-within` classes to remain accessible via keyboard. Additionally, nesting `<button>` inside `<Link>` disrupts both HTML validity and screen reader navigation.
**Action:** Always ensure hover-triggered actions have corresponding focus triggers and avoid nesting interactive tags by using styled `<span>` or `<div>` inside links.
