## 2026-04-18 - SearchBar Keyboard Navigation & ARIA
**Learning:** The search dropdown lacked a keyboard-accessible combobox pattern, making it unusable for non-mouse users. Implementing `aria-activedescendant` on the input linked to the results listbox is the most robust way to handle focus without manually moving focus between elements, which keeps the input active for continuous typing.
**Action:** Always implement ArrowUp/Down and Enter navigation for search dropdowns, ensuring `aria-activedescendant` and visual highlights are synchronized.
