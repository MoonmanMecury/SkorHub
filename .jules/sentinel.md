## 2026-04-18 - Hardened Webhook Signature Verification
**Vulnerability:** Insecure webhook signature verification in Lenco handler.
**Learning:** The previous implementation used a loose check (`if (hashKey && signature)`) which would skip verification if the signature header was missing even if a secret key was configured (fail open). It also used standard string comparison (`===`) which is vulnerable to timing attacks.
**Prevention:** Always enforce signature presence if a secret key is configured. Use `crypto.timingSafeEqual` for comparing cryptographic hashes to ensure constant-time comparison regardless of the input's correctness.
