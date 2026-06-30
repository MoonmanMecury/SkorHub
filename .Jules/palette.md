## 2025-05-15 - [SearchBar Accessibility & UX]
**Learning:** Using `type="search"` in Next.js/React components provides better mobile keyboard integration (showing the 'search' action key) but can introduce a native browser clear button that conflicts with custom UI.
**Action:** Use `[&::-webkit-search-cancel-button]:appearance-none` in Tailwind to hide the native clear button when implementing a custom, stylistically consistent one, and always wrap search inputs in a `<form role="search">` for optimal screen reader support.
