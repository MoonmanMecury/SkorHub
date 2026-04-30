
const ALLOWED_DOMAIN = 'streamed.pk';

/**
 * Validates if the given URL is safe to fetch.
 * 1. Must be a valid URL.
 * 2. Must use HTTPS.
 * 3. Must be from streamed.pk or its subdomains.
 */
function isSafeUrl(urlStr: string): boolean {
    try {
        const url = new URL(urlStr);
        if (url.protocol !== 'https:') return false;

        const hostname = url.hostname.toLowerCase();
        return hostname === ALLOWED_DOMAIN || hostname.endsWith('.' + ALLOWED_DOMAIN);
    } catch {
        return false;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    if (!isSafeUrl(imageUrl)) {
        console.warn(`Blocked SSRF attempt or invalid URL: ${imageUrl}`);
        return new Response('Invalid or restricted URL', { status: 403 });
    }

    try {
        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': `https://${ALLOWED_DOMAIN}/`
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            return new Response(`Remote server returned ${response.status}`, { status: response.status });
        }

        const contentType = response.headers.get('Content-Type');
        const arrayBuffer = await response.arrayBuffer();

        return new Response(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
