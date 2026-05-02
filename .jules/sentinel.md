## 2025-05-15 - SSRF and Credential Leakage in Image Proxy
**Vulnerability:** The `/api/images` route was an open proxy that allowed fetching any URL provided via the `url` parameter. It also unconditionally attached an `IMAGES_API_KEY` to these requests.
**Learning:** Unvalidated URL proxying can lead to Server-Side Request Forgery (SSRF), allowing attackers to probe internal networks or use the server as a proxy. Attaching API keys to unvalidated external requests can leak credentials to malicious third-party servers.
**Prevention:** Always use a strict allowlist of hostnames for proxying, enforce HTTPS, and only attach sensitive credentials after the destination URL has been validated as a trusted host.
