## 2025-05-14 - Timing Attack in Lenco Webhook Signature Verification
**Vulnerability:** Timing attack in HMAC signature comparison.
**Learning:** Using standard loose comparison (`!==`) for cryptographic signatures can leak information about the correct signature through execution time differences, potentially allowing an attacker to forge valid-looking requests.
**Prevention:** Always use `crypto.timingSafeEqual` with constant-time Buffer comparisons for all cryptographic signature validations.
