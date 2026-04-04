## 2026-04-04 - SSRF and XSS Prevention in Image Proxy
**Vulnerability:** The image proxy endpoint (`/api/images`) allowed arbitrary URLs, enabling Server-Side Request Forgery (SSRF) and could be used to serve malicious non-image content (XSS risk).
**Learning:** Open proxies without hostname whitelisting are common entry points for SSRF. Even with whitelisting, failing to verify the response `Content-Type` can allow attackers to proxy malicious scripts if the trusted domain has an upload vulnerability or misconfigured headers.
**Prevention:** Always use a strict whitelist for remote hostnames and verify that the response from the upstream server matches the expected MIME type (e.g., `image/*`) before serving it to the client.
