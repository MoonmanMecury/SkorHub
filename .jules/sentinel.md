## 2025-05-14 - Lenco Webhook Security Hardening
**Vulnerability:** The Lenco webhook handler was vulnerable to signature bypass (if header/config missing) and timing attacks.
**Learning:** Default comparison (`!==`) for HMAC signatures is unsafe. `crypto.timingSafeEqual` must be used with Buffers of equal length.
**Prevention:** Always enforce signature presence and use constant-time comparison for all security-sensitive webhooks.
