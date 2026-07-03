## 2025-05-14 - SearchBar Accessibility and UX
**Learning:** Using `aria-live="polite"` on a search results dropdown ensures that screen reader users are notified when results update dynamically, providing an equivalent experience to sighted users. Additionally, using `type="search"` with custom clear button logic requires hiding the browser's native clear button (e.g., `[&::-webkit-search-cancel-button]:appearance-none`) to avoid visual duplication.
**Action:** Always include `aria-live` on dynamic result containers and prefer semantic `role="search"` on form wrappers for search components.
