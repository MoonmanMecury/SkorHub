## 2026-04-02 - Robust SSRF Protection
**Vulnerability:** Bypassable URL prefix check for image proxy.
**Learning:** Using `url.startsWith('https://trusted.com/')` can be bypassed using userinfo (e.g., `https://trusted.com:80@evil.com/`) which some parsers or fetch implementations might interpret as a request to `evil.com`.
**Prevention:** Always use the `URL` constructor to parse incoming URLs and explicitly verify the `hostname` or `origin` property against a strict allowlist.
