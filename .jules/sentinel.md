## 2026-03-15 - SSRF Protection in Image Proxy

**Vulnerability:** Unvalidated `url` parameter in `app/api/images/route.ts` allowed the server to fetch content from any host. This posed a Server-Side Request Forgery (SSRF) risk and could have leaked the `IMAGES_API_KEY` to unauthorized 3rd parties.

**Learning:** Implementing a strict whitelist of protocols (`https:`) and hostnames (`streamed.pk`) is an effective first line of defense for proxy endpoints. Additionally, running `pnpm install` for linting verification in this environment may generate a massive `pnpm-lock.yaml` that exceeds patch size limits; this file must be deleted before submission.

**Prevention:** Always parse and validate external URLs before using them in `fetch` or other outbound request libraries. Use `new URL()` for robust parsing and check both `protocol` and `hostname`.
