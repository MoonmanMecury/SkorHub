/**
 * Security Utility Functions
 */

const ALLOWED_IMAGE_HOSTS = [
  "streamed.pk",
  "placehold.co",
  "images.unsplash.com",
  "i.ibb.co",
];

/**
 * Validates if an image URL's hostname is in the allowed list.
 * Prevents SSRF attacks by restricting which domains the proxy can fetch from.
 */
export function isValidImageHost(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_IMAGE_HOSTS.some(
      (host) =>
        parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}
