## 2025-06-03 - Nested Interactive Elements in Next.js/React
**Learning:** Nesting a `<button>` inside a `<Link>` or `<a>` tag is invalid HTML and causes accessibility issues, as both are interactive elements.
**Action:** Use a `<span>` or `<div>` styled to look like a button for nested visual elements, ensuring only the parent container remains interactive for screen readers and keyboard navigation.
