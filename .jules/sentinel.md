# Sentinel's Journal

## 2025-05-15 - Mandatory Webhook Signature Verification
**Vulnerability:** Conditional webhook signature verification allowed bypass by omitting the signature header.
**Learning:** The previous implementation only verified the HMAC if both the secret key and the signature header were present. This meant that if an attacker omitted the `x-lenco-signature` header, the entire verification block was skipped, allowing unauthorized webhook events to be processed.
**Prevention:** Always enforce mandatory signature verification for webhooks. If the secret key is not configured or the signature header is missing, the request must be rejected with an appropriate error (e.g., 401 Unauthorized or 500 Configuration Error).
