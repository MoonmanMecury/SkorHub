## 2025-05-15 - Lenco Webhook Verification Bypass
**Vulnerability:** Signature verification was optional if the signature header was missing.
**Learning:** Using `if (key && signature)` for verification blocks allows attackers to bypass security by simply omitting the header.
**Prevention:** Always enforce mandatory checks for both secret configuration and signature headers, returning explicit error codes (500 for config, 401 for missing/invalid auth) instead of silently skipping validation.
