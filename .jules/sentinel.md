## 2026-04-18 - SSRF and Credential Leakage in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) and potential leakage of `IMAGES_API_KEY`.
**Learning:** The image proxy route blindly fetched any URL provided in the `url` query parameter and appended a sensitive `X-API-KEY` header to the request. This could be exploited to scan internal networks or leak the API key to a malicious server.
**Prevention:** Always validate and sanitize URLs before fetching them in a proxy. Enforce secure protocols (HTTPS) and use a strict hostname allowlist to restrict requests to trusted domains.
