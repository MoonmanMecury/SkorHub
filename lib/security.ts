/**
 * Security utility functions
 */

/**
 * Validates if a URL is safe to redirect to or fetch from.
 * Prevents SSRF and Open Redirect vulnerabilities.
 *
 * @param url The URL to validate
 * @param allowedDomains List of allowed hostnames (e.g., ['example.com'])
 * @returns boolean indicating if the URL is safe
 */
export function isSafeUrl(url: string, allowedDomains: string[] = []): boolean {
    if (!url) return false;

    // 1. Handle relative URLs (must start with / but not // or /\ which can be used to bypass)
    if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
        return true;
    }

    try {
        const parsedUrl = new URL(url);

        // 2. Only allow standard web protocols
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return false;
        }

        const hostname = parsedUrl.hostname;

        // 3. Check against allowed domains (including subdomains)
        return allowedDomains.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );
    } catch {
        // Invalid URL
        return false;
    }
}
