## 2025-05-15 - Repository Hygiene in Performance PRs
**Learning:** Including auto-generated artifacts (like `pnpm-lock.yaml` or `dev_server.log`) in a performance PR significantly obscures the actual optimization and risks rejection, regardless of the quality of the logic changes.
**Action:** Explicitly verify and clean up the workspace before submission, ensuring only intended source code changes are included.

## 2025-05-15 - Parallel Data Fetching in Next.js Server Components
**Learning:** Sequential `await` calls in Server Components create unnecessary network waterfalls.
**Action:** Use `Promise.all` to parallelize independent data fetches to minimize TTFB.

## 2025-05-15 - Algorithmic Filtering in Render Path
**Learning:** Using `.find()` inside `.filter()` results in O(N*M) complexity, which scales poorly as match lists grow.
**Action:** Convert the lookup array into a `Set` (or Map) for O(1) lookups, reducing complexity to O(N+M).
