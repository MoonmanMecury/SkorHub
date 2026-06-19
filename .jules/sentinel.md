## 2025-05-15 - SSRF and Webhook Security Hardening
**Vulnerability:** Open image proxy in `app/api/images/route.ts` was vulnerable to SSRF, and Lenco webhook in `app/api/webhooks/lenco/route.ts` lacked timing-safe comparison and fail-secure logic.
**Learning:** Image proxies often overlook hostname whitelisting and protocol enforcement, while webhooks frequently omit `crypto.timingSafeEqual` and postpone `JSON.parse`.
**Prevention:** Always whitelist hostnames for SSRF-prone routes, enforce HTTPS, and use timing-safe comparisons for any HMAC signature verification. Verify signatures before resource-intensive operations like JSON parsing.
