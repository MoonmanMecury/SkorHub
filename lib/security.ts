
/**
 * Security Utility Functions
 */

/**
 * Validates if a URL's hostname is within an allowed list of domains or their subdomains.
 * Prevents SSRF by restricting external requests to trusted sources.
 */
export function isSafeUrl(url: string, allowedDomains: string[]): boolean {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;

        return allowedDomains.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );
    } catch {
        return false;
    }
}
