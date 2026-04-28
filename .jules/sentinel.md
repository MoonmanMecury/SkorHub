## 2026-04-18 - SSRF Protection in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) and Credential Leakage in `/api/images`.
**Learning:** An image proxy that accepts a `url` parameter without validation can be used to scan internal networks or leak API keys if they are appended to all requests.
**Prevention:** Implement a strict hostname allowlist, enforce HTTPS, and only append sensitive headers (like `X-API-KEY`) when communicating with trusted upstream hosts.
