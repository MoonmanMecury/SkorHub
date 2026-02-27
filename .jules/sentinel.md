## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Hardcoded fallback secret for JWT signing and verification in `lib/auth.ts`.
**Learning:** Hardcoded fallbacks are often added during development for convenience but can easily leak into production, allowing attackers to forge tokens (including admin tokens) if the environment variable is accidentally omitted.
**Prevention:** Always enforce the presence of cryptographic secrets at runtime by throwing an error if they are missing. Avoid all forms of hardcoded "dev" secrets in the core codebase.
