## 2025-05-14 - Lenco Webhook Fail-Open & Timing Attack
**Vulnerability:** The Lenco webhook was skipping signature verification if the header was missing and used insecure string comparison for HMAC verification, making it vulnerable to authentication bypass and timing attacks.
**Learning:** Defaulting to success when configuration is missing (fail-open) is a common but dangerous pattern. Cryptographic signatures must always be compared in constant-time.
**Prevention:** Explicitly check for configuration presence and use `crypto.timingSafeEqual` with fixed-length buffers for all signature verifications.
