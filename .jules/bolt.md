## 2025-05-15 - [PR Scope and Environment Hygiene]
**Learning:** Combining multiple performance wins (even small ones) into a single PR violates the Bolt agent's mission of ONE improvement and leads to rejection. Additionally, running `pnpm install` in the sandbox can generate a massive `pnpm-lock.yaml` that causes PR pollution if accidentally staged.
**Action:** Strictly limit each PR to a single optimization area and always verify `git status` to ensure lockfiles or other environment artifacts are not included in the submission.
