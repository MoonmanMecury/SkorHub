## 2025-05-14 - SSRF in Image Proxy
**Vulnerability:** The `/api/images` route was an open proxy, allowing arbitrary GET requests to any URL, potentially leaking the `IMAGES_API_KEY` to attacker-controlled domains and enabling internal network scanning.
**Learning:** Image proxies that take a `url` parameter are high-risk SSRF vectors if they don't implement strict validation of the target host and protocol.
**Prevention:** Always implement a hostname whitelist, enforce HTTPS, and validate the `Content-Type` of the response when building proxy services.
