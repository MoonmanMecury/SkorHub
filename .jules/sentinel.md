## 2025-05-15 - SSRF in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF)
**Learning:** An open image proxy that allows arbitrary URLs can be used to scan internal networks, access cloud metadata services, and leak API keys (passed in headers) to attacker-controlled servers.
**Prevention:** Implement strict URL validation: enforce HTTPS, whitelist allowed hostnames via environment variables, validate upstream Content-Type, and add security headers like `X-Content-Type-Options: nosniff`.
