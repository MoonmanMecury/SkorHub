
import { NextResponse } from 'next/server';

/**
 * SSRF Protection: List of allowed domains we proxy images from.
 * In this app, we only trust streamed.pk for sports assets.
 */
const ALLOWED_HOSTS = ['streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);

        // 1. SSRF Prevention: Only allow HTTPS and whitelisted hostnames
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Invalid protocol. HTTPS required.', { status: 403 });
        }

        if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
            console.warn(`[Security] Blocked unauthorized image proxy attempt to: ${parsedUrl.hostname}`);
            return new Response('Unauthorized image host', { status: 403 });
        }

        // Use the IMAGES_API_KEY from environment variables
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                // 2. Secret Protection: Only send API key to whitelisted hosts (already verified above)
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/'
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            // Don't leak exact upstream status to client, use 502 Bad Gateway
            return new Response('Upstream image server error', { status: 502 });
        }

        // 3. MIME-Type Validation: Ensure the upstream actually returned an image
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.startsWith('image/')) {
            console.error(`Invalid Content-Type for ${imageUrl}: ${contentType}`);
            return new Response('Invalid image content', { status: 415 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error: unknown) {
        // Log error but return generic response to avoid leaking internal stack traces
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
