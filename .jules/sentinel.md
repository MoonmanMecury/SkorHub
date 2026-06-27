## 2025-05-15 - SSRF in Image Proxy
**Vulnerability:** The `/api/images` endpoint allowed arbitrary URL proxying, enabling Server-Side Request Forgery (SSRF) against internal services (e.g., `localhost:3000/api/health`).
**Learning:** Open proxy endpoints are a common vector for SSRF, especially when used for image optimization or bypassing CORS.
**Prevention:** Always implement a strict whitelist of allowed hostnames, enforce secure protocols (HTTPS), and validate the upstream Content-Type to ensure only expected media types are processed. Add `X-Content-Type-Options: nosniff` to prevent MIME-type sniffing by browsers.
