## 2025-03-12 - SSRF in Image Proxy
**Vulnerability:** The `/api/images` endpoint allowed proxying requests to any URL provided via the `url` query parameter.
**Learning:** This could be exploited for Server-Side Request Forgery (SSRF) to scan internal networks or access internal metadata services, and could leak the `IMAGES_API_KEY` to malicious external domains.
**Prevention:** Always validate and restrict URLs in proxy endpoints using a strict protocol (HTTPS) and a hostname allowlist.
