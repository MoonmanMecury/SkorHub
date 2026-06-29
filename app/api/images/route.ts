
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const url = new URL(imageUrl);

        // 1. Enforce HTTPS
        if (url.protocol !== 'https:') {
            return new Response('Only HTTPS protocol is allowed', { status: 400 });
        }

        // 2. Hostname Whitelisting
        const allowedHosts = (process.env.ALLOWED_IMAGE_HOSTS || 'streamed.pk')
            .split(',')
            .map(h => h.trim());

        if (!allowedHosts.includes(url.hostname)) {
            console.warn(`Blocked unauthorized image proxy request to: ${url.hostname}`);
            return new Response('Unauthorized hostname', { status: 403 });
        }

        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/'
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            return new Response(`Remote server returned ${response.status}`, { status: response.status });
        }

        // 3. Upstream Content-Type Validation
        const contentType = response.headers.get('Content-Type');
        if (contentType && !contentType.startsWith('image/')) {
            return new Response('Remote server did not return an image', { status: 400 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType || 'image/jpeg',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error: unknown) {
        console.error('Image proxy error:', error instanceof Error ? error.message : error);
        return new Response('Invalid URL or error fetching image', { status: 500 });
    }
}
