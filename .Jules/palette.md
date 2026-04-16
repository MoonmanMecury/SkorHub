## 2025-05-15 - Improving Accessibility for Hover-only Interactive Elements
**Learning:** Elements that use 'opacity-0 group-hover:opacity-100' for a "clean" UI are invisible to keyboard users and screen readers unless explicitly handled. Screen readers need 'aria-label' for icon-only buttons, and keyboard users need 'focus-visible:opacity-100' to see the element when it receives focus.
**Action:** Always include 'focus-visible' utility classes alongside hover-based visibility logic and ensure icon-only buttons have descriptive ARIA labels.

## 2025-05-15 - Avoiding Nested Interactive Elements
**Learning:** Nesting a <button> inside a <Link> (anchor) is invalid HTML and breaks screen reader navigation patterns. It can cause unpredictable click behavior and accessibility violations.
**Action:** Use a <div> or <span> with button-like styling for decorative indicators inside links, or refactor to sibling interactive elements if distinct actions are needed.
