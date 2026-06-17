## 2025-05-15 - SSRF Protection in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) in `app/api/images/route.ts` via unvalidated `url` parameter.
**Learning:** The proxy fetched any URL provided, allowing potential internal network scanning or access to unauthorized external resources.
**Prevention:** Implement strict hostname whitelisting, protocol enforcement (HTTPS), and response `Content-Type` validation.
