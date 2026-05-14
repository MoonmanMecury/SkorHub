## 2025-05-15 - Timing Attack Prevention in Webhooks
**Vulnerability:** Standard string comparison (`!==`) was used for HMAC signature verification in the Lenco webhook handler, which is vulnerable to timing attacks.
**Learning:** Node.js's `crypto.timingSafeEqual` requires both buffers to be of equal length. Failing to check length before calling it will cause a `TypeError`. Additionally, using `Buffer.from(signature, 'hex')` is more efficient than the default UTF-8 encoding when dealing with hex-encoded signatures.
**Prevention:** Always use `crypto.timingSafeEqual` for sensitive comparisons and ensure length parity check is performed first. Use explicit encoding when creating buffers from hex strings.
