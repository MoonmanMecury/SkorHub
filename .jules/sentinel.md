# Sentinel Security Journal

## 2025-02-26 - [Insecure JWT Secret Fallback]
**Vulnerability:** The application used a hardcoded fallback string ('fallback_secret_during_dev') for `JWT_SECRET` if the environment variable was missing. This was used to both sign and verify JWT tokens.
**Learning:** Hardcoded fallbacks for cryptographic secrets can lead to full authentication bypass if an attacker knows or guesses the fallback. In this codebase, the `getSession` function trusted the `isAdmin` claim in the JWT, meaning anyone could forge an admin token by signing it with the known fallback secret.
**Prevention:** Critical security configuration like `JWT_SECRET` must be required and the application should fail to start if it is missing. Hardcoded secrets or weak fallbacks should never be present in the source code.
