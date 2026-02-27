## 2025-05-14 - Redundant Hook State vs Context
**Learning:** In high-density UIs (e.g., many match cards), using a hook that manages its own state and effects leads to redundant network calls and state desynchronization. Moving state to a central Provider reduces overhead and ensures consistency.
**Action:** Always prefer context for shared state that involves side effects or data fetching used by many leaf components.

## 2025-05-14 - Sequential SSR Fetches
**Learning:** Awaiting multiple independent API calls sequentially in a Server Component increases TTFB linearly.
**Action:** Use Promise.all to parallelize data fetching in pages to minimize server response time.
