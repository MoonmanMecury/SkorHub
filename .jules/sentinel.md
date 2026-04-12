## 2026-04-12 - SSRF and XSS Prevention in Image Proxy
**Vulnerability:** The image proxy endpoint at `app/api/images/route.ts` was an open proxy, allowing requests to any hostname and serving any content type. This could lead to SSRF (accessing internal services) and XSS (serving malicious scripts disguised as images).
**Learning:** Open proxies in API routes are high-risk entry points. Restricting hostnames to a whitelist and validating response `Content-Type` headers are essential defense-in-depth measures.
**Prevention:** Always use the `URL` constructor for robust hostname validation and verify that proxied content matches the expected MIME type before returning it to the client.
