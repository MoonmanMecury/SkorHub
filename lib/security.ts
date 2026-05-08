
/**
 * Security utilities for SkorHub
 */

/**
 * Validates if a URL is safe to fetch from the server side.
 * Prevents SSRF by checking allowed protocols and domains.
 *
 * @param urlString The URL to validate
 * @param allowedDomains List of allowed hostnames (e.g., ['streamed.pk'])
 * @returns boolean indicating if the URL is safe
 */
export function isSafeUrl(urlString: string, allowedDomains: string[]): boolean {
    try {
        const url = new URL(urlString);

        // 1. Only allow http and https
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return false;
        }

        // 2. Validate hostname against allowed domains
        // We check for exact match or subdomains
        const hostname = url.hostname;
        return allowedDomains.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );
    } catch {
        return false;
    }
}
