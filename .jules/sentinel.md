## 2025-05-15 - SSRF and Secret Leakage via Image Proxy
**Vulnerability:** The `/api/images` route acted as an open proxy, fetching any URL provided in the `url` parameter and appending the sensitive `IMAGES_API_KEY` to the request headers.
**Learning:** Open proxies that include internal secrets in outgoing requests are high-risk targets for attackers to exfiltrate those secrets by providing a URL to an attacker-controlled server.
**Prevention:** Implement a strict domain allowlist for proxies and use the `URL` constructor to safely parse and validate the hostname before making external requests.
