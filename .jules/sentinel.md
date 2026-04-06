## 2026-04-06 - [SSRF vulnerability in image proxy]
**Vulnerability:** The `/api/images` endpoint allowed fetching arbitrary URLs, leading to a Server-Side Request Forgery (SSRF) vulnerability.
**Learning:** Open proxies without hostname validation can be exploited to probe internal networks or access unauthorized external resources.
**Prevention:** Always validate user-provided URLs against a strict whitelist of allowed domains and verify the returned `Content-Type` to ensure it matches the expected format.
