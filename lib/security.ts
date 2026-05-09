
/**
 * Security utility for URL validation to prevent SSRF and Open Redirects.
 */
export function isSafeUrl(url: string | null | undefined, allowedDomains: string[]): boolean {
    if (!url) return false;

    try {
        // Handle relative URLs (starts with / but not // or /\)
        if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
            return true;
        }

        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;

        return allowedDomains.some(domain => {
            // Exact match or subdomain match
            return hostname === domain || hostname.endsWith('.' + domain);
        });
    } catch {
        return false;
    }
}
