## 2025-05-15 - Timing Attack Prevention in Webhooks
**Vulnerability:** Timing attack vulnerability in Lenco webhook signature verification due to direct string comparison (`!==`).
**Learning:** Using `crypto.timingSafeEqual` is essential for comparing cryptographic hashes. Additionally, when using `Buffer.from()` on values from request headers, always provide a fallback (e.g., `|| ''`) because `Buffer.from(null)` throws a `TypeError` in Node.js, which would lead to a 500 Internal Server Error instead of a 401 Unauthorized.
**Prevention:** Use a reusable timing-safe comparison helper or ensure all cryptographic comparisons use `crypto.timingSafeEqual` with proper null/undefined checks.
