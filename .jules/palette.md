# Palette Journal

## 2025-05-15 - Improving Search Accessibility and Card Interactions
**Learning:** Standard search dropdowns often lack keyboard navigation (Arrow keys/Enter) and proper ARIA roles, making them unusable for screen reader and keyboard-only users. Similarly, icon-only buttons like 'favorites' are often inaccessible if they lack descriptive labels and focus-visible states.
**Action:** Always implement `role="combobox"`, `aria-activedescendant`, and keyboard listeners for dropdowns. Ensure icon buttons have `aria-label` and are visible on focus.
