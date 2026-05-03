## 2025-05-14 - SSRF in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) and Open Proxy via unvalidated `url` parameter in `/api/images`.
**Learning:** The proxy blindly fetched any URL provided, which could be used to scan internal networks or use the server as a proxy. It also leaked `IMAGES_API_KEY` to any requested URL.
**Prevention:** Implement a strict hostname allowlist (`streamed.pk` and subdomains) and validate protocols (`https:`) before fetching. Only attach sensitive headers after validation.
