## 2026-04-11 - Parallelization and Targeted Fetching in Server Components
**Learning:** Sequential `await` calls in Next.js Server Components create unnecessary network waterfalls. Additionally, fetching global datasets and filtering in-memory is significantly slower and more resource-intensive than using targeted API endpoints.
**Action:** Always parallelize independent data fetches using `Promise.all` and prioritize targeted API endpoints (e.g., `getMatchesBySport(id)`) over manual filtering of global data. Refactor data processing logic out of JSX to improve readability and type safety.
