## 2025-05-09 - Centralized URL Validation
**Vulnerability:** Open Redirect in `app/api/auth/confirm/route.ts` and SSRF/Credential Leakage in `app/api/images/route.ts`.
**Learning:** Using a centralized `isSafeUrl` utility prevents fragmented security logic and ensures consistent protection against bypasses like protocol-relative URLs (`//`) and Windows-style paths (`/\`).
**Prevention:** Always validate user-provided URLs before using them in server-side redirects or fetch calls. Use a strict allowlist for external domains and ensure relative paths do not lead to protocol-relative or UNC path bypasses.
