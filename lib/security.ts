
/**
 * Security utility functions for the application.
 */

/**
 * Validates a URL to prevent Open Redirects and SSRF attacks.
 *
 * @param url The URL to validate
 * @param allowedDomains List of allowed external domains (e.g., ['streamed.pk'])
 * @returns boolean True if the URL is safe
 */
export function isSafeUrl(url: string, allowedDomains: string[] = []): boolean {
    if (!url) return false;

    // 1. Allow internal relative paths (must start with / and not // or /\)
    if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
        return true;
    }

    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;

        // 2. Check against allowed domains
        // This handles exact matches and subdomains, preventing suffix-based bypasses
        return allowedDomains.some(domain => {
            return hostname === domain || hostname.endsWith('.' + domain);
        });
    } catch {
        // If it's not a valid URL and not a safe relative path, it's unsafe
        return false;
    }
}
