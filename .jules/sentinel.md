## 2026-04-09 - SSRF and XSS Prevention in Image Proxy
**Vulnerability:** The image proxy in `app/api/images/route.ts` was an open proxy that allowed any URL to be fetched and served, posing a Server-Side Request Forgery (SSRF) risk and potential XSS if non-image content was proxied.
**Learning:** Open proxies are high-risk entry points. Even if intended for images, lack of hostname and content-type validation allows them to be used for scanning internal networks or serving malicious payloads.
**Prevention:** Always use a hostname whitelist for proxying external content and validate the `Content-Type` of the remote response to ensure it matches the expected type (e.g., `image/*`).
