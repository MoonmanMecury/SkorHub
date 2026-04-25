## 2026-04-18 - SSRF in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) and Potential Credential Leakage.
**Learning:** The image proxy route was fetching arbitrary URLs from user input and attaching an internal API key to those requests. An attacker could use this to probe internal networks or leak the `IMAGES_API_KEY` by providing a malicious URL.
**Prevention:** Always use a hostname allowlist and enforce secure protocols (https:) when proxying external requests. Avoid sending sensitive headers like API keys to untrusted destinations.
