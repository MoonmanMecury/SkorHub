## 2025-05-14 - SSRF vulnerability in image proxy
**Vulnerability:** The `/api/images` endpoint allowed proxying any URL, enabling Server-Side Request Forgery (SSRF) against internal and external targets.
**Learning:** Blindly fetching user-provided URLs in server-side routes can expose internal infrastructure and be used to bypass egress filters. Enforcement of protocol, hostname whitelisting, and content-type validation are essential layers of defense.
**Prevention:** Always implement a strict hostname whitelist for proxy endpoints, enforce secure protocols (HTTPS), and validate the upstream response headers before serving the content.
