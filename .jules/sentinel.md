## 2025-05-14 - Open Redirect in Auth Confirmation
**Vulnerability:** Open Redirect
**Learning:** The `next` parameter in the auth confirmation route was used directly in `NextResponse.redirect` without validation, allowing attackers to redirect users to malicious external domains after a successful login or verification.
**Prevention:** Use a utility function like `isSafeUrl` to validate that the redirect target is an internal relative path and doesn't use protocol-relative URLs (e.g., `//evil.com`) to bypass simple prefix checks.
