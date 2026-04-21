## 2026-04-18 - SSRF in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) and API Key Leakage.
**Learning:** The image proxy route was fetching arbitrary URLs provided in search parameters and attaching a sensitive `X-API-KEY`. This allowed attackers to proxy requests to internal infrastructure or leak the API key by pointing the proxy to a malicious external server.
**Prevention:** Implement strict URL validation, enforce `https:` protocol, and maintain a hostname allowlist for all proxy/fetch operations involving user-provided URLs.
