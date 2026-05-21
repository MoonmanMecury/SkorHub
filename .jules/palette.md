## 2025-05-15 - Improving keyboard visibility for hover-only elements
**Learning:** Elements that are only visible on hover (like 'Favorite' buttons) are completely inaccessible to keyboard users unless they are explicitly shown on focus using `focus-visible:opacity-100`.
**Action:** Always pair `opacity-0` with `focus-visible:opacity-100` and a focus ring for interactive elements revealed on hover.

## 2025-05-15 - Minimizing PR Noise and Artifact Hygiene
**Learning:** Including environment artifacts like `pnpm-lock.yaml` (when not adding dependencies) or `dev_server.log` significantly clutters PRs and triggers scope-creep concerns. Also, resolving pre-existing lint warnings by changing component interfaces can be perceived as a regression.
**Action:** Carefully audit staged files before submission. Use `git reset` to exclude artifacts. Prioritize minimal diffs and interface stability over aggressive lint fixing in unrelated areas.
