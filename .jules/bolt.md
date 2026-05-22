## 2025-05-15 - Eliminating Network Waterfalls in Next.js Server Components
**Learning:** Sequential `await` calls in Server Components create unnecessary network waterfalls. Using `Promise.all` allows these requests to be initiated in parallel, significantly improving Time to First Byte (TTFB).
**Action:** Always look for independent `await` calls in `async` components and parallelize them.

## 2025-05-15 - Specialized API Endpoints vs. Client-side Filtering
**Learning:** Fetching a full dataset and filtering it locally is a common anti-pattern that wastes bandwidth and CPU. Utilizing specialized API endpoints (like `getMatchesBySport`) is always preferable.
**Action:** Review data fetching logic to ensure the most specific available API endpoint is being used.
