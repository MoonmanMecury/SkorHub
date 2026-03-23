## 2025-05-15 - SSRF Vulnerability in Image Proxy
**Vulnerability:** The image proxy at `app/api/images/route.ts` was found to be unhardened and vulnerable to Server-Side Request Forgery (SSRF) and `IMAGES_API_KEY` leakage. It accepted any URL via the `url` query parameter and fetched it, including the sensitive API key in the headers.
**Learning:** Image proxies that accept arbitrary URLs without validation can be used to scan internal networks or access internal services. Additionally, sensitive headers should only be sent to trusted domains.
**Prevention:** Always validate protocols and hostnames for image proxies. Restrict fetches to `https:` and a whitelist of trusted domains (e.g., `streamed.pk`).
