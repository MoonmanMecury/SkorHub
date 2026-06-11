## 2026-06-11 - SSRF Prevention in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) via open image proxy.
**Learning:** Open proxy endpoints that fetch arbitrary URLs from user input are susceptible to SSRF, allowing attackers to scan internal networks or use the server as a relay.
**Prevention:** Implement strict hostname whitelisting, enforce HTTPS, and validate the `Content-Type` of the remote response before serving it. Returning generic error codes (e.g., 502) for upstream failures also prevents information leakage.
