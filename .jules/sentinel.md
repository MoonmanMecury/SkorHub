## 2025-05-15 - Lenco Webhook Unauthenticated Access
**Vulnerability:** The Lenco webhook handler was processing payloads even when the `LENCO_WEBHOOK_HASH_KEY` was missing from the environment or the `x-lenco-signature` header was missing from the request.
**Learning:** Optional signature verification logic (using `if (key && sig) { ... }`) can lead to unauthenticated access if environment variables are misconfigured or headers are omitted by attackers.
**Prevention:** Always enforce the presence of security keys and headers, returning an error early if they are missing, and use `crypto.timingSafeEqual` for secure comparison.
