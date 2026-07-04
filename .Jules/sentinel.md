## 2025-05-14 - Lenco Webhook Authentication Bypass and Timing Attack

**Vulnerability:** The Lenco webhook implementation was vulnerable to authentication bypass and timing attacks. It used insecure loose string comparison (`!==`) for signature verification, failed "open" if the hash key or signature was missing, and performed expensive JSON parsing before authentication.

**Learning:** This specific endpoint has a history of regressions where secure logic is periodically replaced by simpler but insecure implementations. Relying on optional signature checks (e.g., `if (hashKey && signature)`) allows an attacker to bypass authentication by simply omitting the signature header.

**Prevention:** Always implement "fail-secure" logic for webhooks. Require both the configuration key and the signature header to be present, and use `crypto.timingSafeEqual` for all cryptographic comparisons. Ensure that untrusted input (the request body) is only processed (e.g., via `JSON.parse`) after successful authentication to mitigate DoS risks.
