## 2026-04-01 - Lenco Webhook Insecurity
**Vulnerability:** Weak signature verification in Lenco payment webhook handler and potential SQL injection.
**Learning:** The implementation skipped signature checks if `LENCO_WEBHOOK_HASH_KEY` was missing and used standard string comparison for HMAC, making it susceptible to bypasses and timing attacks. It also used string interpolation for dynamic SQL fragments.
**Prevention:** Always mandate the presence of a secret key and signature header, use `crypto.timingSafeEqual` for comparisons, and strictly use parameterized queries for all database interactions.
