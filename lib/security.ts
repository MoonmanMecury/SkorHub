/**
 * Validates if a URL is safe for redirection or proxying.
 * - Allows safe internal relative paths (e.g., /dashboard)
 * - Allows absolute URLs from an explicit list of trusted domains
 *
 * @param url The URL string to validate
 * @param allowedDomains List of trusted domain names (e.g., ['streamed.pk'])
 */
export function isSafeUrl(url: string | null | undefined, allowedDomains: string[] = []): boolean {
    if (!url) return false;

    // Check for safe relative paths: starts with / but not // or /\ (which can bypass checks)
    if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
        return true;
    }

    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;

        // Check if hostname matches or is a subdomain of an allowed domain
        return allowedDomains.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );
    } catch {
        return false;
    }
}
