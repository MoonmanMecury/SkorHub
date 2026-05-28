## 2025-05-15 - Improving Interactive Element Visibility on Focus

**Learning:** Interactive elements hidden behind hover states (e.g., `opacity-0 group-hover:opacity-100`) are inaccessible to keyboard users unless explicitly handled. Using `group-focus-within:opacity-100` alongside `focus-visible` ensures these elements appear when their container or they themselves receive focus.

**Action:** Always pair hover-based visibility with `group-focus-within` or `focus-within` to maintain accessibility for keyboard and screen reader users.
