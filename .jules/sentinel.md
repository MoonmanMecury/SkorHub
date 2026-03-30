## 2025-05-15 - SSRF Protection for Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) in the image proxy endpoint.
**Learning:** The proxy route was fetching arbitrary URLs from user input without validation, allowing potential internal network scanning or access to sensitive metadata services.
**Prevention:** Implement strict protocol (HTTPS only) and hostname (whitelist) validation on any external URLs before fetching them. Using the `URL` constructor for parsing is more robust than regex or string manipulation.
