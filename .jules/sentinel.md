# Sentinel's Journal

## 2025-05-22 - [Insecure Webhook Signature Bypass]
**Vulnerability:** Critical authentication bypass in Lenco webhook handler.
**Learning:** The code only performed signature verification if *both* `LENCO_WEBHOOK_HASH_KEY` and the `x-lenco-signature` header were present. This meant if the hash key was not configured in the environment, or if an attacker simply omitted the signature header, the security check was skipped entirely.
**Prevention:** Always make security checks mandatory. Explicitly fail (e.g., 500 error) if required security configuration is missing, and reject requests (e.g., 401 error) if required security headers are absent. Never use `if (config && header)` as a guard for security logic.

## 2025-05-22 - [Timing Attack Risk in HMAC Comparison]
**Vulnerability:** Medium-risk timing attack vulnerability during HMAC verification.
**Learning:** Standard string comparison (`==` or `!==`) returns as soon as a mismatch is found, allowing an attacker to brute-force a signature byte-by-byte by measuring the server's response time.
**Prevention:** Always use `crypto.timingSafeEqual()` when comparing cryptographic hashes or signatures. Ensure the input buffers have the same length before comparison to avoid leakage.
