## 2025-05-15 - Lenco Webhook Signature Bypass
**Vulnerability:** Signature verification was optional and used unsafe comparison. If the 'x-lenco-signature' header was missing, the check was skipped entirely.
**Learning:** Conditional security checks (if signature then check) create a "fail open" vulnerability. Mandatory checks are required.
**Prevention:** Always ensure security headers are present and valid before processing sensitive requests, and use `crypto.timingSafeEqual` for cryptographic comparisons.
