/**
 * Validates if a URL is safe to use for redirects or proxying.
 * Prevents Open Redirects and SSRF.
 */
export function isSafeUrl(url: string | null | undefined, allowedDomains: string[] = []): boolean {
    if (!url) return false;

    // 1. Check for relative paths
    // Must start with / but NOT // or /\ which can be used for protocol-relative or path bypasses
    if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
        return true;
    }

    // 2. Check for absolute URLs
    try {
        const parsed = new URL(url);

        // Only allow http or https
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return false;
        }

        const hostname = parsed.hostname;

        // Check if hostname is in allowedDomains or is a subdomain of an allowed domain
        return allowedDomains.some(domain => {
            return hostname === domain || hostname.endsWith('.' + domain);
        });
    } catch {
        // Not a valid absolute URL and doesn't meet relative path criteria
        return false;
    }
}
