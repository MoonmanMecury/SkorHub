import { NextResponse } from 'next/server';

const ALLOWED_DOMAINS = ['streamed.pk'];

/**
 * Image Proxy Route
 * GET /api/images?url=...
 *
 * Proxies images from allowed domains to avoid CORS issues and protect user privacy.
 * Includes SSRF protection and fetch timeouts.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);

        // 1. SSRF Protection: Only allow https
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Invalid protocol. Only HTTPS is allowed.', { status: 400 });
        }

        // 2. SSRF Protection: Whitelist domains
        const hostname = parsedUrl.hostname;
        const isAllowed = ALLOWED_DOMAINS.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );

        if (!isAllowed) {
            return new Response('Forbidden domain', { status: 403 });
        }

        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        // 3. DoS Protection: Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        try {
            const response = await fetch(imageUrl, {
                headers: {
                    'X-API-KEY': apiKey || '',
                    'Accept': 'image/*',
                    'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
                },
                cache: 'no-cache',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
                return new Response(`Remote server returned ${response.status}`, { status: response.status });
            }

            const contentType = response.headers.get('Content-Type');
            const arrayBuffer = await response.arrayBuffer();

            return new NextResponse(Buffer.from(arrayBuffer), {
                headers: {
                    'Content-Type': contentType || 'image/jpeg',
                    'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
                    'X-Content-Type-Options': 'nosniff' // Security header
                },
            });
        } catch (fetchError: unknown) {
            clearTimeout(timeoutId);
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                return new Response('Request timed out', { status: 504 });
            }
            throw fetchError;
        }
    } catch (error: unknown) {
        if (error instanceof TypeError && error.message.includes('Invalid URL')) {
            return new Response('Invalid URL format', { status: 400 });
        }
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
