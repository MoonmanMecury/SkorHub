## 2025-03-27 - [CRITICAL] Image Proxy SSRF and API Key Leakage
**Vulnerability:** The `/api/images` endpoint allowed arbitrary URLs via the `url` parameter, which were then fetched by the server. Crucially, the server would send the `IMAGES_API_KEY` in the `X-API-KEY` header to whatever URL was provided.
**Learning:** Image proxies that take unvalidated URL parameters are highly susceptible to SSRF and can be used to exfiltrate internal credentials or perform network scanning from the application's origin.
**Prevention:** Always implement a strict hostname whitelist for external proxy requests and ensure sensitive headers (like API keys) are only sent to trusted upstream hosts.
