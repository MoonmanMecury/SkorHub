## 2025-05-15 - Hardening Image Proxy against SSRF and Secret Leakage
**Vulnerability:** The image proxy in `app/api/images/route.ts` accepted any arbitrary URL via the `url` query parameter and forwarded the `IMAGES_API_KEY` to it.
**Learning:** Image proxies that fetch user-provided URLs are high-risk entry points for Server-Side Request Forgery (SSRF) and can inadvertently leak sensitive API keys to malicious external hosts if not strictly whitelisted.
**Prevention:** Always implement a strict hostname whitelist and enforce secure protocols (HTTPS) for any proxy-like functionality. Use the standard `URL` API for robust validation and ensure secrets are only sent to trusted domains.
