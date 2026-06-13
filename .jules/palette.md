## 2026-06-13 - Interactive elements nested in Links
**Learning:** Nesting <button> elements inside <Link> (which renders as <a>) is invalid HTML and causes accessibility issues for keyboard/screen reader users.
**Action:** Use a <span> styled as a button for purely visual 'action' indicators inside Links, and ensure separate interactive elements like 'Favorite' buttons are correctly positioned and accessible via focus-visible styles.
