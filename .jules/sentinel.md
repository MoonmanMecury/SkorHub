## 2026-04-11 - Secured Image Proxy against SSRF and XSS
**Vulnerability:** The image proxy in `app/api/images/route.ts` was fetching any user-provided URL without validation, leading to potential Server-Side Request Forgery (SSRF). Additionally, it didn't verify the `Content-Type` of the proxied response, which could be used to serve malicious non-image content.
**Learning:** Open proxies are a common target for SSRF. Validating the hostname and the response content type are essential defense-in-depth measures.
**Prevention:** Always use the `URL` constructor to validate and parse user-provided URLs. Implement strict allowlists for hostnames and verify that the remote response matches the expected `Content-Type` before relaying it to the client.
