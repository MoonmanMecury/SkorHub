
import { NextResponse } from 'next/server';

const ALLOWED_HOSTNAMES = ['streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrlParam = searchParams.get('url');

    if (!imageUrlParam) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    let imageUrl: URL;
    try {
        imageUrl = new URL(imageUrlParam);
    } catch {
        return new Response('Invalid URL format', { status: 400 });
    }

    // 1. Enforce HTTPS
    if (imageUrl.protocol !== 'https:') {
        return new Response('Only HTTPS protocol is allowed', { status: 400 });
    }

    // 2. Validate Hostname
    if (!ALLOWED_HOSTNAMES.includes(imageUrl.hostname)) {
        return new Response('Forbidden hostname', { status: 403 });
    }

    try {
        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl.toString(), {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            // Use generic error to avoid leaking specific remote server status codes to potential attackers
            return new Response('Failed to fetch from remote server', { status: 502 });
        }

        const contentType = response.headers.get('Content-Type');

        // 3. Verify Content-Type is an image
        if (!contentType || !contentType.toLowerCase().startsWith('image/')) {
            return new Response('Remote resource is not an image', { status: 400 });
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
