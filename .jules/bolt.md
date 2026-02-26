# Bolt's Journal - Optimization Learnings

## 2026-02-26 - [Optimizing Redundant Side Effects in Custom Hooks]
**Learning:** In applications with high-density components (like MatchCards and EventCards) that each track independent pieces of state or trigger side effects (e.g., localStorage sync, DB fetch), using a local custom hook with `useEffect` in each instance causes significant overhead. This leads to redundant disk I/O, multiple network requests on login, and unnecessary re-renders across the component tree.
**Action:** Centralize such state and effects in a React Context Provider at the root. This ensures that initialization and synchronization happen exactly once, providing a single source of truth and drastically reducing the performance tax during hydration and user authentication.
