## 2026-04-18 - SSRF and Credential Leakage in Image Proxy
**Vulnerability:** The image proxy route at `app/api/images/route.ts` was vulnerable to Server-Side Request Forgery (SSRF) and credential leakage because it accepted any URL via query parameters and unconditionally attached the `IMAGES_API_KEY` to outbound requests.
**Learning:** Open proxies that append secrets to requests are high-risk. Attackers can use them to scan internal networks or leak secrets to their own servers.
**Prevention:** Always validate protocols (enforce https:), implement a strict hostname allowlist, and only attach sensitive credentials when the destination is a trusted, verified host.
