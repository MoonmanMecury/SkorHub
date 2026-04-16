## 2026-04-16 - Lenco Webhook Authentication Bypass
**Vulnerability:** Authentication Bypass & Timing Attack
**Learning:** The webhook signature verification was conditionally executed only if both the hash key and the signature header were present. This meant an attacker could bypass authentication entirely by omitting the `x-lenco-signature` header, even if a secret key was configured on the server.
**Prevention:** Always enforce the presence of security headers when a corresponding secret key is configured. Use `crypto.timingSafeEqual` for sensitive comparisons to prevent side-channel timing attacks.
