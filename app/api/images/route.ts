
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    // 1. Security Check: SSRF Protection
    try {
        const parsedUrl = new URL(imageUrl);
        // Only allow requests to the trusted sports data provider
        if (parsedUrl.hostname !== 'streamed.pk') {
            return new Response('Forbidden: Untrusted hostname', { status: 403 });
        }
    } catch {
        return new Response('Invalid URL format', { status: 400 });
    }

    try {
        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            return new Response(`Remote server returned ${response.status}`, { status: response.status });
        }

        // 2. Security Check: Content-Type Validation (XSS Protection)
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.startsWith('image/')) {
            console.error(`Blocked non-image content-type: ${contentType} from ${imageUrl}`);
            return new Response('Forbidden: Invalid content type', { status: 403 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
                // Security header to prevent content type sniffing
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
