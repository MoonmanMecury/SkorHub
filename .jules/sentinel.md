## 2026-06-04 - SSRF in Image Proxy
**Vulnerability:** The image proxy endpoint (`app/api/images/route.ts`) fetched any URL provided in the `url` parameter, allowing for Server-Side Request Forgery (SSRF).
**Learning:** Proxy endpoints that accept external URLs must be strictly validated. Hostname whitelisting is the most effective defense. Additionally, returning generic error codes (like 502) prevents leaking information about the internal network or the upstream server's status.
**Prevention:** Always use a whitelist of allowed domains for proxy requests and validate the protocol (http/https). Never leak specific upstream errors to the client.
