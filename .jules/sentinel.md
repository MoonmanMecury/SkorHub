## 2025-05-21 - Fail-secure Webhook Verification
**Vulnerability:** Timing attacks in signature verification and potential DoS via large JSON payloads.
**Learning:** Standard string comparison (`!==`) for HMAC signatures is vulnerable to timing attacks. Parsing JSON before verification allows unauthenticated users to trigger resource-intensive operations.
**Prevention:** Always use `crypto.timingSafeEqual` for signature comparisons and postpone `JSON.parse` until after the request has been authenticated/verified.
