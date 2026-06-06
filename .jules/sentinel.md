## 2026-06-06 - Mandatory Fail-Secure Webhook Verification
**Vulnerability:** The Lenco webhook handler was using a "fail-open" pattern where signature verification was skipped if the secret key or signature header was missing. It also used a non-constant-time string comparison for the HMAC, susceptible to timing attacks.
**Learning:** Webhook handlers must explicitly validate the presence of all security-critical configuration and headers before processing payloads. Using `crypto.timingSafeEqual` is mandatory for comparing cryptographic signatures to prevent side-channel leaks.
**Prevention:** Always implement a guard clause that returns an error (401/500) if security prerequisites are not met. Use `Buffer.from(hmac, 'hex')` and `crypto.timingSafeEqual` for all signature comparisons.
