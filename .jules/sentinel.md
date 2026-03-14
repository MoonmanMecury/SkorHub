## 2025-05-14 - Hardened Webhook Signature Verification and SQL Injection Prevention
**Vulnerability:**
1. The Lenco webhook bypassed signature verification if the hash key was missing and was vulnerable to timing attacks due to standard string comparison.
2. Insecure SQL interpolation was used for calculating expiry dates in both webhook and manual verification routes.

**Learning:**
1. Node.js `crypto.timingSafeEqual` throws an error if Buffers have different lengths; a manual length check is mandatory.
2. Using SQL `CASE` statements within parameterized queries is a secure and efficient way to handle conditional logic that would otherwise tempt developers into using insecure string interpolation for SQL fragments.

**Prevention:**
1. Always enforce mandatory signature headers for webhooks.
2. Use constant-time comparison for all cryptographic signatures.
3. Never use string interpolation for SQL fragments like `INTERVAL` or `NULL`; push the logic into the query using `CASE` or similar constructs.
