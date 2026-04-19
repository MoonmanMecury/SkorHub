## 2026-04-18 - SSRF Protection in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) in the image proxy route.
**Learning:** The proxy allowed fetching from any URL provided in the query string, which could be used to probe internal network services or bypass cross-origin restrictions.
**Prevention:** Enforce HTTPS, restrict hostnames to a known allowlist, and validate the `Content-Type` of the proxied response to ensure only images are served.
