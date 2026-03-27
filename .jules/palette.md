## 2025-05-14 - Keyboard Navigation for Search Results
**Learning:** Accessible search result dropdowns must implement keyboard navigation (Arrow keys, Enter, Escape) and link the input to the active option using 'aria-activedescendant' and unique element IDs to ensure screen reader and power user compatibility.
**Action:** Always implement a custom `onKeyDown` handler and ARIA combobox attributes for any dropdown-based search or selection components.
