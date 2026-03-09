# Sentinel Security Journal

## 2025-03-09 - Image Proxy SSRF and Secret Leakage
**Vulnerability:** The image proxy at `/api/images` accepted any URL, allowing for SSRF. It also blindly sent the `IMAGES_API_KEY` to any provided URL.
**Learning:** Image proxies must be restricted to a whitelist of allowed domains and protocols. Secrets should only be sent to trusted upstream servers.
**Prevention:** Always validate external URLs against a whitelist and conditionally attach sensitive headers.

## 2025-03-09 - Webhook Timing Attack and Loose Validation
**Vulnerability:** The Lenco webhook used loose equality for signature verification, making it susceptible to timing attacks. It also didn't strictly enforce the presence of the signature header or hash key.
**Learning:** `crypto.timingSafeEqual` is mandatory for cryptographic comparisons. Webhooks must fail closed if configuration or security headers are missing.
**Prevention:** Use `crypto.timingSafeEqual` with Buffers of equal length and implement explicit checks for all security-critical inputs.
