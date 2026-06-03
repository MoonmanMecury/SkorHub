## 2026-06-03 - SSRF Protection in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) in `/api/images`.
**Learning:** The image proxy was fetching any URL provided via the `url` query parameter without validation. This could be exploited to scan internal services or access restricted external resources using the server's identity.
**Prevention:** Implement a strict whitelist for allowed hostnames and protocols (e.g., only `https:` and trusted domains like `streamed.pk`). Validate URLs using the `URL` constructor and return generic error messages for failed requests.
