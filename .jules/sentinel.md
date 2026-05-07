## 2025-05-14 - SSRF Protection Pattern for Proxy Routes
**Vulnerability:** Server-Side Request Forgery (SSRF) and Credential Leakage.
**Learning:** The application had an image proxy that fetched any URL provided in query parameters and attached an internal API key to all requests. This could be exploited to reach internal services or leak the `IMAGES_API_KEY` to attacker-controlled domains.
**Prevention:** Centralized hostname validation logic in `lib/security.ts`. Use `isSafeUrl` to restrict proxying to known trusted domains (e.g., `streamed.pk`) before initiating any outbound requests or attaching sensitive headers.
