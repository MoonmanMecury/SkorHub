## 2026-04-10 - Secure Image Proxy against SSRF
**Vulnerability:** The image proxy endpoint (`app/api/images/route.ts`) accepted any URL without validation, enabling Server-Side Request Forgery (SSRF) and allowing the server to be used as a general-purpose proxy or for internal network probing.
**Learning:** Open proxy endpoints are a high-risk vector for SSRF. Even if intended for images, lack of hostname and content-type validation can lead to security bypasses or data exfiltration.
**Prevention:** Always implement strict hostname whitelisting using the `URL` constructor for reliable parsing and verify the `Content-Type` header of the proxied response to ensure it matches expectations (e.g., `image/*`).
