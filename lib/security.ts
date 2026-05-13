/**
 * Validates if a URL is safe to prevent SSRF and Open Redirects.
 */
export function isSafeUrl(url: string, allowedDomains: string[] = []): boolean {
    if (!url) return false;
    if (url.startsWith('/')) {
        return !url.startsWith('//') && !url.startsWith('/\\');
    }
    try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) return false;
        return allowedDomains.some(d => parsed.hostname === d || parsed.hostname.endsWith('.' + d));
    } catch {
        return false;
    }
}
