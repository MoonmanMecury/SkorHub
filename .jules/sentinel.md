## 2026-06-09 - Secure Image Proxy Implementation
**Vulnerability:** Server-Side Request Forgery (SSRF) and Information Leakage in `app/api/images/route.ts`.
**Learning:** Image proxies that fetch from user-provided URLs are high-risk for SSRF. Implementing strict hostname whitelisting (`streamed.pk`) and protocol enforcement (`https:`) is critical. Additionally, "fail-secure" error handling (returning generic 502/500 instead of upstream status codes) prevents leaking infrastructure details.
**Prevention:** Always validate remote URLs against a strict whitelist and sanitize `Content-Type` headers from upstream responses to ensure they match the expected format (e.g., `image/*`).
