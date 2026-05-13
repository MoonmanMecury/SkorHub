## 2025-05-13 - Implement Centralized URL Validation to Prevent SSRF and Open Redirects
**Vulnerability:** Unrestricted Server-Side Request Forgery (SSRF) was identified in the `app/api/images/route.ts` endpoint, which allowed proxying requests to any arbitrary URL.
**Learning:** Proxying user-provided URLs without validation is a high-risk pattern that can be exploited to access internal services or perform port scanning from the server's perspective. While this app is a frontend-heavy Next.js app, such proxies are common "blind spots".
**Prevention:** Use the centralized `isSafeUrl` utility in `lib/security.ts` to validate all user-provided URLs against a domain allowlist before performing server-side fetches or redirects.
