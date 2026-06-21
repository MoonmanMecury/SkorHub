## 2025-05-15 - SSRF Protection in Image Proxy
**Vulnerability:** The `/api/images` route was a blind proxy that fetched any URL provided in the `url` query parameter. This could be exploited for Server-Side Request Forgery (SSRF) to scan internal networks or access unauthorized external resources.
**Learning:** Open proxies in Next.js API routes are high-risk targets. They are often added for convenience (e.g., bypassing CORS or referrer checks) but must be strictly limited to trusted domains.
**Prevention:** Always implement a strict hostname whitelist and enforce HTTPS for any server-side proxying logic. Validate the response `Content-Type` to ensure it matches the expected resource type.
