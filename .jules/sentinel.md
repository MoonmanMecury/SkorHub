# Sentinel Journal 🛡️

## 2025-05-14 - SSRF in Image Proxy
**Vulnerability:** The image proxy at `/api/images` allowed fetching from any arbitrary URL, which could lead to SSRF and leakage of `IMAGES_API_KEY`.
**Learning:** Image proxies that accept unvalidated URL parameters are highly susceptible to SSRF. Even with custom headers like `Referer`, if the destination isn't restricted, it can be abused.
**Prevention:** Always implement a strict hostname whitelist and validate the protocol (e.g., enforce HTTPS) for any proxying endpoint.
