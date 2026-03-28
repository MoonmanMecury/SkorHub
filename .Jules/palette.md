## 2026-03-28 - Focus States and ARIA Labels for Interactive Elements
**Learning:** Interactive elements that are hidden by default (opacity-0) must be made visible on focus (focus-visible:opacity-100) to ensure they are accessible to keyboard users. Additionally, icon-only buttons like favorite toggles or logo links with hidden text must have explicit aria-labels for screen reader support.
**Action:** Always include focus-visible:opacity-100 on hover-only interactive elements and provide descriptive aria-labels for all icon-only buttons.
