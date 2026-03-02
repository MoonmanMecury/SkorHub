## 2025-05-15 - Timing-Safe Verification of HMAC Signatures
**Vulnerability:** Timing attack vulnerability in webhook signature verification.
**Learning:** Using a standard `!==` comparison for HMAC signatures allows attackers to potentially brute-force the signature byte-by-byte by measuring response times.
**Prevention:** Always use `crypto.timingSafeEqual` for cryptographic comparisons. Note that this function requires Buffers of equal length, so an explicit length check or try-catch block is necessary before comparison.

## 2025-05-15 - SSRF in Image Proxy
**Vulnerability:** Server-Side Request Forgery (SSRF) in unprotected image proxy.
**Learning:** An unvalidated `url` parameter in a server-side proxy allows attackers to make the server fetch internal or external resources, potentially leaking sensitive headers like `X-API-KEY`.
**Prevention:** Implement strict domain allowlisting for all proxy targets. Use the `URL` constructor to reliably parse and validate hostnames.

## 2025-05-15 - Insecure Default Secret Fallbacks
**Vulnerability:** Hardcoded fallback secrets for JWT and webhooks.
**Learning:** Providing default "dev" secrets in code often leads to them being used in production if environment variables are misconfigured.
**Prevention:** Fail fast and fail securely. Throw a critical error during application startup if required cryptographic secrets are missing from the environment.
