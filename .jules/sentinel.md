## 2025-05-14 - Fix SSRF in Image Proxy
**Vulnerability:** The `/api/images` route was fetching arbitrary URLs provided in query parameters without any validation.
**Learning:** Developers often implement image proxies to bypass CORS or referer checks but forget that this creates an SSRF vector where the server can be used to scan internal networks or access internal metadata services.
**Prevention:** Use a strict allowlist of trusted domains for any server-side fetching triggered by user input. Implement a centralized URL validation utility to ensure consistency across the codebase.
