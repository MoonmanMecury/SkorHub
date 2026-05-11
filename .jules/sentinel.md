## 2025-05-11 - SSRF and API Key Leakage in Image Proxy
**Vulnerability:** The `/api/images` route was an open proxy that accepted any `url` parameter and attached the sensitive `IMAGES_API_KEY` to the outbound request.
**Learning:** Open proxies in API routes can lead to SSRF and, more critically, the leakage of internal secrets if those secrets are automatically attached to proxy requests.
**Prevention:** Always validate external URLs against a strict allowlist of domains using a robust parser like the native `URL` constructor. Use a helper like `isSafeUrl` to centralize this logic.
