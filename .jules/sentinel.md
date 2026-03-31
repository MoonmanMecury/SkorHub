## Sentinel Journal

## 2026-03-31 - SSRF in Image Proxy
**Vulnerability:** The `/api/images` endpoint allowed proxying requests to any URL without validation, enabling Server-Side Request Forgery (SSRF).
**Learning:** Image proxies that take a full URL as a parameter are a common entry point for SSRF if not strictly restricted to trusted domains and protocols.
**Prevention:** Always validate that the URL is absolute, uses HTTPS, and belongs to a whitelist of allowed hostnames before fetching.
