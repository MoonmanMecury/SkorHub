# Sentinel Security Journal

## 2025-05-14 - Fix SSRF in Image Proxy
**Vulnerability:** Unvalidated `url` parameter in `app/api/images/route.ts` allowed arbitrary server-side requests (SSRF).
**Learning:** Image proxies that fetch remote content are prime targets for SSRF; even if they seem harmless, they can be used to scan internal networks or bypass firewalls.
**Prevention:** Implement strict allow-lists for protocols (e.g., `https:`) and hostnames (e.g., `streamed.pk`) when fetching user-provided URLs.
