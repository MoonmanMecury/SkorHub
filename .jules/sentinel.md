## 2026-06-24 - Image Proxy SSRF Vulnerability
**Vulnerability:** The `/api/images` proxy endpoint was susceptible to Server-Side Request Forgery (SSRF), allowing attackers to fetch arbitrary URLs (internal or external) through the server.
**Learning:** Open proxies in the App Router that directly pass user input to `fetch` without validation can be exploited to bypass firewalls or leak sensitive internal data.
**Prevention:** Implement a strict hostname whitelist, enforce HTTPS protocol, validate upstream `Content-Type` (e.g., must start with `image/`), and use `X-Content-Type-Options: nosniff` to prevent MIME-sniffing attacks.
