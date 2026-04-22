## 2026-04-18 - SSRF in Image Proxy
**Vulnerability:** The `/api/images` route accepted a `url` parameter and fetched it without validation, allowing for Server-Side Request Forgery (SSRF).
**Learning:** Image proxies that fetch external content based on user-provided URLs are high-risk entry points for SSRF if they don't restrict allowed hostnames and protocols.
**Prevention:** Always implement a strict allowlist for hostnames and enforce secure protocols (HTTPS) when proxying requests to external services.
