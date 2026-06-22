## 2025-05-15 - Lenco Webhook Fail-Secure Verification
**Vulnerability:** The Lenco webhook handler used an `if (hashKey && signature)` block for signature verification. If the environment variable `LENCO_WEBHOOK_HASH_KEY` was missing, the check would be skipped entirely, allowing any unauthenticated POST request to be processed as a valid payment.
**Learning:** Optional verification checks based on the presence of secrets can lead to silent authentication bypass if the environment is misconfigured.
**Prevention:** Always implement fail-secure logic: explicitly check for the presence of required secrets and headers, and reject the request with an error status (e.g., 401) if they are missing. Use `crypto.timingSafeEqual` for constant-time comparison of cryptographic hashes.
