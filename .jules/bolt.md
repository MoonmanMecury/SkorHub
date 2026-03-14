## 2025-05-14 - Optimized List Filtering in Home Page

**Learning:** Using nested `.find()` or `.includes()` inside a `.filter()` or `.map()` creates an O(N*M) complexity. In the Home Page, filtering out live matches from the 'Upcoming' list using `.find()` was an anti-pattern that would degrade performance as the number of matches grows.

**Action:** Always prefer using a `Set` for O(1) lookups when filtering or checking for existence in a list during a loop, reducing complexity to O(N + M).
