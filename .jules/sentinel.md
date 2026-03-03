## 2025-05-22 - SSRF and API Key Leakage in Image Proxy
**Vulnerability:** The `/api/images` proxy endpoint accepted arbitrary URLs and attached the sensitive `IMAGES_API_KEY` to the request headers.
**Learning:** This created a Server-Side Request Forgery (SSRF) vulnerability and allowed attackers to steal the internal API key by providing a URL to a server they control.
**Prevention:** Always validate user-provided URLs against a strict allowlist of domains and protocols (e.g., HTTPS only) before performing server-side fetches, especially when including secrets in the request.
