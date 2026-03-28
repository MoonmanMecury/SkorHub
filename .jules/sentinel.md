## 2026-03-28 - Secure Webhook Signature Verification
**Vulnerability:** The Lenco webhook handler was using a "fail-open" signature verification logic where the check was only performed if *both* the `LENCO_WEBHOOK_HASH_KEY` and the `x-lenco-signature` header were present. If either was missing, the handler would skip verification and proceed to process the payment, allowing anyone to spoof payment confirmations if the environment was misconfigured or by simply omitting the header. Additionally, it used standard string comparison which is vulnerable to timing attacks.

**Learning:** Webhook security must always "fail-secure". If a secret is required for verification, its absence should be treated as a configuration error (500), and the absence of a signature in the request should be treated as unauthorized (401).

**Prevention:**
1. Mandate the presence of the webhook secret and the signature header.
2. Use `crypto.timingSafeEqual` with Buffers for constant-time comparison to prevent timing attacks.
3. Ensure the length of the signature buffer matches the HMAC buffer before calling `timingSafeEqual` as it throws if lengths differ.
