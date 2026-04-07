## 2025-04-07 - Accessible Keyboard Navigation for Search Dropdowns
**Learning:** In dark-themed search dropdowns, using a combination of a colored background tint (e.g., 'bg-primary/20') and a vertical accent border (e.g., 'border-l-2 border-primary') for the active item significantly improves the visibility of keyboard focus.
**Action:** Always implement `aria-activedescendant` on the input to point to the active search result, and sync the `activeIndex` state with `onMouseEnter` to provide a consistent experience across keyboard and mouse interactions.
