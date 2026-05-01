
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);

        // 1. Enforce HTTPS for security and to prevent local network probing
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Only HTTPS URLs are allowed', { status: 400 });
        }

        // 2. Validate hostname to prevent SSRF and API key leakage
        // We only trust our upstream provider domain
        const allowedDomain = 'streamed.pk';
        const hostname = parsedUrl.hostname;
        const isAllowed = hostname === allowedDomain || hostname.endsWith(`.${allowedDomain}`);

        if (!isAllowed) {
            return new Response('Forbidden: Hostname not allowed', { status: 403 });
        }

        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': `https://${allowedDomain}/`
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
        // Handle invalid URL formats gracefully
        if (error instanceof TypeError && error.message.includes('Invalid URL')) {
            return new Response('Invalid URL format', { status: 400 });
        }
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
