## 2026-05-30 - Hardening Image Proxy against SSRF
**Vulnerability:** Unrestricted server-side image proxy allowing arbitrary external URL fetching while attaching a sensitive `IMAGES_API_KEY`.
**Learning:** An open proxy that attaches credentials to outgoing requests is a high-risk SSRF vector. Without domain whitelisting and timeouts, it can be abused for internal network scanning or resource exhaustion (DoS).
**Prevention:** Always enforce HTTPS for proxied URLs, implement a strict domain whitelist, set reasonable fetch timeouts (e.g., 5s), and add security headers like `X-Content-Type-Options: nosniff` to the response.
