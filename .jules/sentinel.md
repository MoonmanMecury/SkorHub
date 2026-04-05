## 2026-04-05 - SSRF and XSS Protection in Image Proxy
**Vulnerability:** The image proxy endpoint (`/api/images`) was susceptible to Server-Side Request Forgery (SSRF) and Cross-Site Scripting (XSS) via content spoofing. It allowed proxying any URL without hostname validation and served the remote content with its original `Content-Type` without verification.

**Learning:** Image proxies are high-risk endpoints. Without strict validation, they can be used to scan internal networks (SSRF) or serve malicious HTML/SVG files that execute scripts in the context of the application's domain (XSS).

**Prevention:**
1. Use the `URL` constructor to parse and strictly validate the `hostname` against a whitelist.
2. Verify the `Content-Type` of the remote response to ensure it is an expected image format (e.g., `startsWith('image/')`).
3. Set the `X-Content-Type-Options: nosniff` header to prevent browsers from interpreting images as other content types.
