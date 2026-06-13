## 2025-05-15 - Parallel Data Fetching in Server Components
**Learning:** Sequential await calls in Next.js Server Components create waterfalls, significantly increasing total page load time.
**Action:** Always use Promise.all to fetch independent data concurrently in Server Components.
