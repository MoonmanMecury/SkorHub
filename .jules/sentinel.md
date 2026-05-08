## 2025-05-14 - SSRF and Credential Leakage in Image Proxy
**Vulnerability:** The `/api/images` route proxied arbitrary URLs provided by users and attached a secret `IMAGES_API_KEY` to the request headers.
**Learning:** Attaching API keys to proxy requests without strict destination validation allows attackers to steal credentials by redirecting requests to their own servers (Credential Leakage) and probe internal or external networks (SSRF).
**Prevention:** Always use a strict whitelist of allowed domains/hostnames when proxying requests that include authentication headers or access internal resources.
