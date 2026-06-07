## 2026-06-07 - Mandatory Fail-Secure Webhook Verification
**Vulnerability:** The Lenco webhook verification was "fail-open," skipping security checks if the hash key or signature header was missing. It also used standard string comparison, which is vulnerable to timing attacks.
**Learning:** Webhook handlers must explicitly check for the presence of secrets and signatures before processing. Relying on an `if (key && signature)` block implicitly allows unauthenticated requests if either is absent.
**Prevention:** Always implement a "fail-secure" pattern: check for missing configuration/headers first and reject the request. Use `crypto.timingSafeEqual` with Buffers for all sensitive comparisons to mitigate timing-based side-channel attacks.
