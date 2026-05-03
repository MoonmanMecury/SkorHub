
import { NextResponse } from 'next/server';

const ALLOWED_DOMAIN = 'streamed.pk';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        let url: URL;
        try {
            url = new URL(imageUrl);
        } catch (e) {
            return new Response('Invalid URL format', { status: 400 });
        }

        // 1. Protocol Validation
        if (url.protocol !== 'https:') {
            return new Response('Invalid protocol. Only HTTPS is allowed.', { status: 400 });
        }

        // 2. Hostname Validation
        const hostname = url.hostname;
        const isAllowed = hostname === ALLOWED_DOMAIN || hostname.endsWith(`.${ALLOWED_DOMAIN}`);

        if (!isAllowed) {
            console.warn(`Blocked image proxy request to unauthorized host: ${hostname}`);
            return new Response('Unauthorized host', { status: 403 });
        }

        // 3. API Key Protection - Only send to allowed domain
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                ...(apiKey ? { 'X-API-KEY': apiKey } : {}),
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
            },
            cache: 'no-cache'
        });

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
            },
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
