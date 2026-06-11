
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);

        // SSRF Protection: Whitelist allowed hostnames and enforce HTTPS
        const allowedHosts = ['streamed.pk'];
        if (!allowedHosts.includes(parsedUrl.hostname.toLowerCase())) {
            return new Response('Forbidden: Invalid image host', { status: 403 });
        }

        if (parsedUrl.protocol !== 'https:') {
            return new Response('Forbidden: Only HTTPS is allowed', { status: 403 });
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
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            // Return a generic error to avoid leaking upstream status codes or details
            return new Response('Error fetching remote image', { status: 502 });
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType?.toLowerCase().startsWith('image/')) {
            console.error(`Invalid content type from ${imageUrl}: ${contentType}`);
            return new Response('Remote server did not return an image', { status: 415 });
        }
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
