## 2025-05-15 - Hardening Webhook Signature Verification
**Vulnerability:** Weak signature verification in Lenco webhook. It used non-constant-time comparison (`!==`) and skipped verification if `LENCO_WEBHOOK_HASH_KEY` or the signature header was missing.
**Learning:** Standard string comparison is vulnerable to timing attacks. Failing to mandate the presence of verification secrets can lead to bypasses in environments where secrets are not yet configured.
**Prevention:** Mandate both the secret key and signature header. Convert both HMAC and provided signature to Buffers and use `crypto.timingSafeEqual` for comparison.
