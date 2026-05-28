# Bolt Performance Journal

## 2025-05-14 - Initializing Journal
**Learning:** Found that the repository often fetches all matches and filters them client/server side, which is inefficient.
**Action:** Always check for targeted API endpoints (like `getMatchesBySport`) before falling back to `getAllMatches`.
