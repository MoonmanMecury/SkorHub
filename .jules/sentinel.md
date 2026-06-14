## 2025-05-15 - Fail-Secure Webhook Verification
**Vulnerability:** The Lenco webhook handler used an optional verification pattern and was vulnerable to timing attacks and potential DoS via unauthenticated JSON parsing.
**Learning:** Checking for the existence of secrets *before* using them in a cryptographic function is essential for a fail-secure architecture. Standard string comparison for signatures is insecure against timing attacks.
**Prevention:** Always use `crypto.timingSafeEqual` for signature comparisons and defer expensive operations like `JSON.parse` until after successful authentication.
