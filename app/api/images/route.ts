
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        // SSRF Protection: Validate the URL
        const parsedUrl = new URL(imageUrl);

        // 1. Enforce HTTPS
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Invalid protocol', { status: 400 });
        }

        // 2. Hostname Whitelisting (allow only streamed.pk)
        const allowedHost = 'streamed.pk';
        if (parsedUrl.hostname !== allowedHost) {
             return new Response('Forbidden host', { status: 403 });
        }

        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(parsedUrl.toString(), {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            // Fail securely: Return generic 502 Bad Gateway instead of leaking remote status
            console.error(`Failed to fetch image from ${parsedUrl.toString()}: ${response.status}`);
            return new Response('Bad Gateway', { status: 502 });
        }

        const contentType = response.headers.get('Content-Type');

        // 3. Verify Content-Type is an image (case-insensitive check)
        if (!contentType || !contentType.toLowerCase().startsWith('image/')) {
            return new Response('Remote server did not return an image', { status: 400 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error: unknown) {
        // Generic error message to avoid leaking internals
        console.error('Image proxy error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
