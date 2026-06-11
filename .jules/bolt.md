## 2026-06-11 - Parallelizing Data Fetches on Home Page
**Learning:** Sequential `await` calls in Server Components create an unnecessary data-fetching waterfall. Parallelizing independent fetches with `Promise.all` can significantly reduce page load time.
**Action:** Always check for independent `await` calls in page components and consolidate them using `Promise.all` to optimize performance.

## 2026-06-11 - Unintentional Lockfile Generation
**Learning:** Running `pnpm install` in this environment generated a `pnpm-lock.yaml` even though the project uses `package-lock.json`. This can lead to massive, unintended PR diffs.
**Action:** Always verify the file list before submitting and delete any automatically generated lockfiles or temporary files.
