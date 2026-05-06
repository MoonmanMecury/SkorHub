
/**
 * Validates if a URL is safe for local redirection.
 * A safe redirect must start with a single '/' and not '//'
 * (which could be a protocol-relative URL).
 */
export function isSafeRedirect(url: string | null | undefined): boolean {
    if (!url) return false;
    return url.startsWith('/') && !url.startsWith('//');
}
