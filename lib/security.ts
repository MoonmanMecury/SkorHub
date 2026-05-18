
/**
 * Security Utilities
 */

/**
 * Validates if a URL is safe for redirection or proxying.
 * Prevents SSRF and Open Redirect attacks.
 */
export function isSafeUrl(url: string, allowedDomains: string[] = []): boolean {
    if (!url) return false;

    // Allow safe internal relative paths (must start with / but not // or /\ )
    if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
        return true;
    }

    try {
        const parsedUrl = new URL(url);

        // Only allow standard web protocols
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return false;
        }

        const hostname = parsedUrl.hostname;

        // Check if hostname matches any allowed domain or its subdomains
        return allowedDomains.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );
    } catch {
        // Invalid URL
        return false;
    }
}
