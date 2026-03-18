## 2026-03-18 - SSRF Protection for Image Proxy
**Vulnerability:** The `/api/images` endpoint allowed proxying requests to any URL provided in the `url` parameter, including internal services and arbitrary external websites.
**Learning:** Image proxies that take a URL parameter are high-risk for SSRF if not strictly validated.
**Prevention:** Always validate protocols (HTTPS only) and use a strict whitelist for hostnames allowed to be proxied.
