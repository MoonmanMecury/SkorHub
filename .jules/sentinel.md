## 2025-05-22 - SSRF Protection in Image Proxy
**Vulnerability:** The image proxy endpoint (`/api/images`) allowed arbitrary URLs to be fetched, making it vulnerable to Server-Side Request Forgery (SSRF). Additionally, a sensitive API key was sent to any requested URL.
**Learning:** Image proxies that take a full URL as a parameter are high-risk. Whitelisting hostnames is an effective mitigation.
**Prevention:** Always validate external URLs against a trusted whitelist and only send credentials to authorized domains.
