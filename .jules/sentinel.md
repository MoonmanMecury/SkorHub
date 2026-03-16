## 2025-05-15 - Security Hardening

**Vulnerability:**
1. SSRF in image proxy route.
2. Insecure hardcoded JWT secret fallback.
3. Webhook signature timing attack.
4. Brittle SQL logic in payment update queries.

**Learning:**
The image proxy allowed arbitrary URLs, which could be used for SSRF. The JWT secret had a default value in code. Webhook verification used a standard comparison operator, which is susceptible to timing attacks. SQL queries used string interpolation for some parts of the logic.

**Prevention:**
Always validate protocols and hostnames for proxy routes. Never include default secrets in the codebase. Use `crypto.timingSafeEqual` for cryptographic signature comparisons. Always use parameterized queries and `CASE` statements for complex SQL logic instead of string interpolation.
