## 2025-05-14 - Lenco Webhook Auth Bypass and Timing Attack
**Vulnerability:** The Lenco webhook handler was missing fail-secure logic, allowing requests to be processed even if the webhook hash key or signature was missing. It also used a standard string comparison for signature verification, which is vulnerable to timing attacks.
**Learning:** Webhook handlers must explicitly check for the presence of authentication credentials and use constant-time comparison functions to verify signatures.
**Prevention:** Always implement a "deny-by-default" approach for webhook authentication and utilize `crypto.timingSafeEqual` for all cryptographic comparisons.
