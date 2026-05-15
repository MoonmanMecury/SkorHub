## 2025-05-15 - Timing Attack and Verification Bypass in Webhooks
**Vulnerability:** The Lenco webhook handler used non-timing-safe string comparison for signatures and allowed bypassing verification if the signature header was missing.
**Learning:** Standard `!==` comparison is vulnerable to timing attacks, and optional signature checks can lead to total authentication bypass in webhooks if not carefully enforced when a secret is present.
**Prevention:** Always use `crypto.timingSafeEqual` with Buffers of identical length for cryptographic comparisons. Enforce mandatory signature headers when a webhook secret is configured.
