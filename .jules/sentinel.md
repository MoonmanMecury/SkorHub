## 2026-06-05 - Fail-Secure Webhook Verification
**Vulnerability:** The Lenco webhook handler was "fail-open," meaning it would skip signature verification if the hash key was not configured or if the signature header was missing. It also used insecure string comparison for signatures.
**Learning:** Webhook authentication must be mandatory and fail-secure. Missing configuration or headers should result in an immediate rejection to prevent unauthorized payment status updates.
**Prevention:** Always require signature headers and secret keys. Use `crypto.timingSafeEqual` for all cryptographic comparisons to prevent timing attacks.
