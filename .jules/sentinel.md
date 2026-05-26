## 2025-05-15 - Lenco Webhook Signature Bypass & Timing Attack
**Vulnerability:** Signature verification was optional (skipped if header was missing) and used insecure string comparison.
**Learning:** The 'if (key && signature)' pattern in webhook handlers creates a silent bypass if the header is omitted. Additionally, standard string comparison is vulnerable to timing attacks.
**Prevention:** Always enforce the presence of security headers and environment variables, returning early with an error if missing. Use 'crypto.timingSafeEqual' for all signature/token comparisons.
