## 2026-04-18 - Accessible Favorite Buttons
**Learning:** Elements visually hidden via `opacity-0` and `group-hover:opacity-100` are completely inaccessible to keyboard users unless explicitly handled. Adding `focus-visible:opacity-100` is essential for making these interactive elements discoverable and usable via Tab navigation.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` for any hidden interactive element.
