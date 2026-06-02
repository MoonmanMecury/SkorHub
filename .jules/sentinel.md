# Sentinel Security Journal

This journal tracks critical security learnings, vulnerability patterns, and prevention strategies identified during security audits and fixes.

## 2025-05-15 - Lenco Webhook Fail-Open and Timing Attack
**Vulnerability:** The Lenco webhook handler was implemented with a "fail-open" pattern where signature verification was only performed if both the secret key and the signature header were present. This meant that a misconfiguration (missing key) or a malicious request (missing signature) would bypass authentication. Additionally, standard string comparison was used for the HMAC, which is vulnerable to timing attacks.

**Learning:** Webhook authentication must be "fail-secure" (deny by default). The presence of both the configuration secret and the request signature must be explicitly verified before any processing occurs. For signature comparisons, constant-time comparison functions like `crypto.timingSafeEqual` are essential to prevent side-channel attacks.

**Prevention:** Always implement mandatory signature checks for webhooks. Use a dedicated `verifySignature` utility that enforces the presence of required headers/keys and uses `crypto.timingSafeEqual` with Buffers. Wrap Buffer conversion in try-catch to handle invalid hex strings gracefully.
