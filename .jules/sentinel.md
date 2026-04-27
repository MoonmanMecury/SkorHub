## 2026-04-27 - Hardened Image Proxy against SSRF and Credential Leakage
**Vulnerability:** The image proxy route in `app/api/images/route.ts` was a generic proxy that forwarded a sensitive `IMAGES_API_KEY` to any URL provided in the query string, enabling Server-Side Request Forgery (SSRF) and credential leakage.
**Learning:** Generic proxies that append authentication tokens to outgoing requests must strictly validate the destination URL's protocol and hostname using a robust parser like `new URL()` to prevent common bypasses.
**Prevention:** Implement a hostname allowlist and enforce HTTPS for all proxied requests. Additionally, validate the `Content-Type` of the response to ensure only expected media types (e.g., images) are served.
