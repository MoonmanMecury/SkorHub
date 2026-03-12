
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(imageUrl);
    } catch {
        return new Response('Invalid URL format', { status: 400 });
    }

    // SSRF Protection: Restrict to HTTPS and allowed hostname
    if (parsedUrl.protocol !== 'https:') {
        return new Response('Invalid protocol', { status: 400 });
    }

    if (parsedUrl.hostname !== 'streamed.pk') {
        return new Response('Forbidden: Host not allowed', { status: 403 });
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
