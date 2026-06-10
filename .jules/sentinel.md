## 2026-06-10 - Fail-Secure Webhook Verification
**Vulnerability:** The Lenco webhook handler used a "fail-open" pattern where signature verification was skipped if the hash key or signature header was missing. It also used a non-timing-safe comparison for the signature.
**Learning:** Webhooks must always fail-secure. If expected security parameters are missing, the request must be rejected. Timing attacks on signatures can be mitigated using timing-safe comparison functions.
**Prevention:** Always validate the presence of security headers and secrets before processing webhooks, and use `crypto.timingSafeEqual` for all signature comparisons.
