## 2025-05-22 - Insecure Webhook Signature Verification
**Vulnerability:** Webhook signature verification was optional if the environment key was missing, and used a timing-vulnerable string comparison.
**Learning:** External integrations like Lenco webhooks are critical "Sources of Truth" for payments and must be secured with mandatory, timing-safe checks to prevent fraudulent payment state updates.
**Prevention:** Always use `crypto.timingSafeEqual` for cryptographic comparisons and ensure authentication secrets are required, not optional.
