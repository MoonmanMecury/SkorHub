## 2026-04-30 - SSRF and Credential Leakage in Image Proxy
**Vulnerability:** The `/api/images` route acted as an open proxy, fetching any URL provided in the `url` query parameter. It also unconditionally attached the `IMAGES_API_KEY` to these requests.
**Learning:** Open proxies without hostname validation are prime targets for SSRF. Attaching secrets like API keys to such requests allows attackers to leak those secrets by providing a URL to a server they control.
**Prevention:** Always validate external URLs against a strict allowlist of hostnames before fetching. Enforce HTTPS for outgoing requests. Only send sensitive headers (like API keys) to trusted domains.
