## 2026-06-01 - SSRF Protection in Image Proxy
**Vulnerability:** Unvalidated 'url' parameter in an image proxy route allowed arbitrary external requests while attaching a sensitive API key.
**Learning:** Image proxies that attach credentials must strictly whitelist destinations and protocols to prevent SSRF and credential leakage.
**Prevention:** Implement hostname whitelisting, enforce HTTPS, and use request timeouts for all proxy-like endpoints.
