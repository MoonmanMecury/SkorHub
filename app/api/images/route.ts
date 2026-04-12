
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    // Security: Validate the URL and restrict to trusted hostnames to prevent SSRF
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(imageUrl);
        if (parsedUrl.hostname !== 'streamed.pk') {
            console.error(`Blocked suspicious image proxy request to: ${parsedUrl.hostname}`);
            return new Response('Forbidden: Invalid hostname', { status: 403 });
        }
    } catch {
        return new Response('Invalid URL parameter', { status: 400 });
    }

    try {
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
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            return new Response(`Remote server returned ${response.status}`, { status: response.status });
        }

        // Security: Verify content type to prevent XSS via polyglot files
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.startsWith('image/')) {
            console.error(`Blocked non-image content type: ${contentType}`);
            return new Response('Forbidden: Only images are allowed', { status: 403 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
