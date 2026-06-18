## 2025-05-15 - Lenco Webhook Hardening
**Vulnerability:** Timing attacks in signature verification and potential DoS via premature JSON parsing.
**Learning:** Using `crypto.timingSafeEqual` is essential for HMAC verification to prevent timing leaks. Additionally, validating the request signature *before* calling `JSON.parse()` prevents unauthenticated users from consuming server resources with large or malformed JSON payloads.
**Prevention:** Always perform signature verification as the very first step in webhook handlers, and use constant-time comparison functions for secrets.
