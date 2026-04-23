## 2026-04-23 - Hardened Image Proxy against SSRF
**Vulnerability:** The image proxy in `app/api/images/route.ts` was fetching arbitrary URLs and passing the `IMAGES_API_KEY` in headers.
**Learning:** Open proxies without hostname validation allow attackers to perform SSRF attacks and leak sensitive credentials to malicious servers.
**Prevention:** Always implement a strict protocol and hostname allowlist for proxy routes. Use the `URL` constructor for robust parsing and avoid `any` in error handlers for better type safety.
