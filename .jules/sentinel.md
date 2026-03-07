## 2025-05-15 - SSRF and Hardcoded Secrets
**Vulnerability:** The image proxy at `app/api/images/route.ts` was vulnerable to Server-Side Request Forgery (SSRF) by accepting any URL without validation. Additionally, `lib/auth.ts` had a hardcoded fallback for `JWT_SECRET`.
**Learning:** Image proxies that fetch external content must strictly validate the protocol and hostname against an allowlist to prevent internal network scanning and credential leakage. Hardcoded secrets, even as fallbacks, are a significant risk if production environment variables are misconfigured.
**Prevention:** Use `new URL()` for parsing, strictly validate protocols (e.g., `https:`), and enforce hostname allowlists. For secrets, throw an error if they are missing in production rather than providing a default.
