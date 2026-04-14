## 2025-05-15 - Optimizing Next.js Server Components

**Learning:** Sequential `await` calls in Server Components create waterfalls that increase TTFB. Using `Promise.all` significantly improves performance. Additionally, complex data processing (like creating Sets for filtering) should be kept outside the `return` statement for better readability and maintainability.

**Action:** Always check for independent data fetches and parallelize them. Move processing logic above the JSX to keep the component clean.
