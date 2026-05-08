## 2025-05-14 - Avoiding Hallucinated Lockfiles
**Learning:** Running `pnpm install` in this environment can generate a `pnpm-lock.yaml` that doesn't match the project's original dependency structure (e.g., `package-lock.json`), leading to massive, irrelevant diffs.
**Action:** Always check for and remove `pnpm-lock.yaml` before submitting if the project uses a different lockfile format or if the generated one is unusually large.
