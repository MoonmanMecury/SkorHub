## 2025-05-27 - Accessible Hover-Hidden Interactive Elements
**Learning:** Interactive elements that are visually hidden until hover (like "Favorite" buttons on cards) are inaccessible to keyboard and screen reader users unless they are also made visible on focus. Standard `aria-label` is required for icon-only buttons.
**Action:** Use `group-focus-within:opacity-100` (or similar focus-triggering classes) on the parent container to ensure these elements appear when navigating via keyboard, and always provide descriptive `aria-label` for icon-only components.
