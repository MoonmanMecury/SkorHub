
/**
 * Security utilities for URL validation and sanitization.
 */

/**
 * Validates if a URL is safe to redirect to or fetch from.
 * Prevents Open Redirects and SSRF by ensuring the URL is either a safe relative path
 * or belongs to an allowed list of domains.
 *
 * @param url The URL string to validate
 * @param allowedDomains List of allowed hostnames (e.g., ['streamed.pk'])
 * @returns boolean indicating if the URL is safe
 */
export function isSafeUrl(url: string | null | undefined, allowedDomains: string[] = []): boolean {
    if (!url) return false;

    // 1. Check if it's an absolute URL
    try {
        const parsed = new URL(url);

        // Only allow http and https protocols
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return false;
        }

        // Check if the hostname is in the allowed list
        const hostname = parsed.hostname.toLowerCase();
        return allowedDomains.some(domain =>
            hostname === domain.toLowerCase() || hostname.endsWith('.' + domain.toLowerCase())
        );
    } catch {
        // Not a valid absolute URL, check if it's a safe relative path

        // Must start with / but not // (protocol-relative) or /\ (often used to bypass filters)
        if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
            return true;
        }

        return false;
    }
}
