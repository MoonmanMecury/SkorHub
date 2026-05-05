
/**
 * Validates if a redirect URL is safe to use.
 * Prevents Open Redirect vulnerabilities by ensuring the URL is internal.
 */
export function isSafeRedirect(url: string | null | undefined): boolean {
  if (!url) return false;

  // Ensure the URL starts with a single '/' and not '//' (which can be protocol-relative)
  // or any other scheme (http:, https:, javascript:, etc.)
  return url.startsWith('/') && !url.startsWith('//');
}
