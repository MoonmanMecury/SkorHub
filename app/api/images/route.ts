
import { NextResponse } from 'next/server';

// Get allowed hostnames from environment or default to streamed.pk
const ALLOWED_HOSTS = process.env.ALLOWED_IMAGE_HOSTS
    ? process.env.ALLOWED_IMAGE_HOSTS.split(',').map(h => h.trim())
    : ['streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);

        // SSRF Protection: Enforce HTTPS
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Only HTTPS is allowed', { status: 400 });
        }

        // SSRF Protection: Whitelist hostnames
        if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
            return new Response('Forbidden hostname', { status: 403 });
        }

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

        const contentType = response.headers.get('Content-Type');

        // SSRF Protection: Validate that the response is actually an image
        if (contentType && !contentType.startsWith('image/')) {
            return new Response('Invalid content type from remote server', { status: 400 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
                'X-Content-Type-Options': 'nosniff' // Prevent MIME-type sniffing
            },
        });
    } catch (error: unknown) {
        console.error('Image proxy error:', error);
        return new Response('Error processing image request', { status: 400 });
    }
}
