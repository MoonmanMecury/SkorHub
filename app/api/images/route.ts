
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const url = new URL(imageUrl);

        // SSRF Prevention: Only allow HTTPS
        if (url.protocol !== 'https:') {
            return new Response('Only HTTPS is allowed', { status: 400 });
        }

        // SSRF Prevention: Hostname whitelisting
        const allowedHosts = process.env.ALLOWED_IMAGE_HOSTS
            ? process.env.ALLOWED_IMAGE_HOSTS.split(',').map(h => h.trim())
            : ['streamed.pk'];

        if (!allowedHosts.includes(url.hostname)) {
            return new Response('Unauthorized image host', { status: 403 });
        }

        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(url.toString(), {
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

        // Security: Ensure the upstream response is actually an image
        if (!contentType || !contentType.startsWith('image/')) {
            return new Response('Invalid content type from remote server', { status: 400 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
                'X-Content-Type-Options': 'nosniff', // Security: prevent MIME-sniffing
            },
        });
    } catch (error: unknown) {
        if (error instanceof TypeError && error.message.includes('Invalid URL')) {
            return new Response('Invalid URL format', { status: 400 });
        }
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
