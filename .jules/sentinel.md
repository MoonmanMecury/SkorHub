## 2026-04-03 - SSRF and XSS in Image Proxy
**Vulnerability:** The `/api/images` endpoint accepted any URL via the `url` query parameter and fetched it without validation. This allowed Server-Side Request Forgery (SSRF), enabling an attacker to make requests to internal services or external domains from the server. Additionally, it could be used for Cross-Site Scripting (XSS) if a malicious file (e.g., SVG with script) was proxied and served with an incorrect or missing `Content-Type`.

**Learning:** Image proxies are common targets for SSRF. Even if the primary goal is to proxy images from a trusted source, failing to strictly validate the hostname and protocol allows attackers to misuse the server as a proxy for arbitrary requests. Sending API keys (like `IMAGES_API_KEY`) to untrusted domains is also a major risk.

**Prevention:** Always validate the `hostname` and `protocol` of URLs passed to a proxy. Use the `URL` constructor for reliable parsing. Additionally, verify the `Content-Type` of the proxied response to ensure it matches the expected type (e.g., `image/*`) before serving it to the client.
