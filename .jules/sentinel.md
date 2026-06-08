
## 2026-06-08 - Fixed SSRF in Image Proxy
**Vulnerability:** The image proxy at `app/api/images/route.ts` was an open proxy, allowing any URL to be fetched via the `url` parameter. This exposed the server to SSRF (Server-Side Request Forgery) and could lead to `IMAGES_API_KEY` leakage if requested by a malicious host.
**Learning:** Open proxies in API routes are a common but critical oversight. Even if intended for images, without hostname whitelisting, they can be abused to probe internal networks or reach metadata services.
**Prevention:** Always implement strict hostname whitelisting and protocol enforcement (HTTPS only) for proxy endpoints. Additionally, validate the remote `Content-Type` to ensure only expected media types are processed.
