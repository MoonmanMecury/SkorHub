## 2025-05-14 - Webhook Hardening and SQL Parameterization
**Vulnerability:** Weak signature verification in payment webhooks and SQL interpolation in update queries.
**Learning:** Node.js `crypto.timingSafeEqual` requires Buffers of identical length; an explicit length check or try/catch block is necessary before comparison to prevent runtime errors when validating signatures of variable lengths.
**Prevention:** Always use `crypto.timingSafeEqual` for signature comparison and parameterized `CASE` statements instead of string interpolation for conditional SQL updates.
