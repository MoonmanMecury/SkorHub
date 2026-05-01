## 2025-05-01 - Preventing SSRF and Credential Leakage in Image Proxies
**Vulnerability:** Server-Side Request Forgery (SSRF) and potential leakage of sensitive API keys to third-party domains.
**Learning:** An open image proxy that accepts any URL and forwards an API key in headers can be exploited to probe internal networks or steal the API key by directing the request to an attacker-controlled server. Suffix-based hostname checks (e.g., `endsWith('streamed.pk')`) can be bypassed by domains like `attackerstreamed.pk`.
**Prevention:** Implement strict hostname validation using an allowlist, enforce HTTPS, and ensure that sensitive headers like `X-API-KEY` are only appended when the destination hostname is fully trusted and verified (exact match or proper subdomain check).
