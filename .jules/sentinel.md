## 2025-03-11 - SSRF in Image Proxy
**Vulnerability:** The `/api/images` route was an open proxy that could fetch any URL provided in the `url` parameter, including internal metadata services or local network resources.
**Learning:** Although `next.config.ts` restricted `remotePatterns` for the `<Image>` component, the custom API route bypasses these client-side restrictions. Security must be enforced at the entry point of the server-side request.
**Prevention:** Always validate and whitelist protocols and hostnames in proxy-like endpoints. Use the `URL` constructor to reliably parse and verify components of the target URL.

## 2025-03-11 - Atomic Security PRs
**Vulnerability:** Multiple unrelated security issues (SSRF, SQL interpolation, Timing attacks) were identified.
**Learning:** Combining multiple security fixes into one PR violates the "ONE small fix" constraint and makes review difficult. Large auto-generated files like `pnpm-lock.yaml` can obscure logic changes and should be avoided unless necessary.
**Prevention:** Focus on the highest priority vulnerability first. Keep PRs under 50 lines and atomic. Avoid committing lockfiles if they exceed size limits or are not strictly required for the fix.
