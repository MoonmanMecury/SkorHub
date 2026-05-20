## 2025-05-20 - Image Proxy SSRF and API Key Leakage
**Vulnerability:** The image proxy endpoint (`/api/images`) allowed proxying requests to any URL, making it vulnerable to Server-Side Request Forgery (SSRF). Additionally, it sent the `IMAGES_API_KEY` to any requested URL, leading to potential API key leakage.
**Learning:** Whitelisting domains is essential for proxy endpoints. A simple `.includes()` check for sensitive header injection is insufficient and can be bypassed with crafted paths.
**Prevention:** Use strict hostname validation against an allowlist. Always parse URLs to perform reliable hostname checks. Implement timeouts to prevent DoS via slow remote servers.
