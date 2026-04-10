## 2025-05-14 - Interactive Elements Hidden by Hover
**Learning:** Elements that use `opacity-0 group-hover:opacity-100` for aesthetic reasons become completely inaccessible to keyboard users unless they also have `focus-visible:opacity-100`.
**Action:** Always pair hover-based visibility with `focus-visible` visibility and clear focus indicators (rings/borders).
