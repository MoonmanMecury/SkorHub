## 2025-01-24 - Image Proxy SSRF Protection
**Vulnerability:** Server-Side Request Forgery (SSRF) in `app/api/images/route.ts`.
**Learning:** An image proxy that accepts a `url` parameter can be used to make internal network requests or hit unauthorized external endpoints if not properly restricted.
**Prevention:** Always validate protocols (e.g., enforce HTTPS), allowlist specific hostnames, and verify the `Content-Type` of the upstream response to ensure it matches the expected media type (e.g., `image/*`).
