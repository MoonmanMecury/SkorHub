## 2025-05-15 - Hardened Image Proxy against SSRF
**Vulnerability:** The image proxy route was an open proxy, allowing any URL to be fetched and potentially leaking the internal `IMAGES_API_KEY`.
**Learning:** Open proxies are high-risk SSRF vectors; hostname whitelisting and protocol enforcement are essential first lines of defense.
**Prevention:** Always implement strict domain whitelisting, enforce secure protocols (HTTPS), and use fetch timeouts to prevent resource exhaustion when proxying external content.
