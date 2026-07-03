## 2025-05-15 - Lenco Webhook Fail-Secure and Timing Attack Fix
**Vulnerability:** Authentication bypass and timing attack in Lenco webhook handler.
**Learning:** The initial implementation used optional signature verification (if-checks on presence) and insecure string comparison (`!==`). It also parsed the request body before verifying the sender, increasing the attack surface.
**Prevention:** Always enforce signature presence (fail secure), use `crypto.timingSafeEqual` for cryptographic comparisons, and defer processing untrusted input (like `JSON.parse`) until after successful authentication.
