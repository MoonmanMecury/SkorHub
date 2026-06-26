
import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const url = new URL(imageUrl);

        // 1. Enforce HTTPS to prevent insecure transport and certain SSRF tricks
        if (url.protocol !== 'https:') {
            return new Response('Insecure protocol - Only HTTPS is allowed', { status: 400 });
        }

        // 2. Hostname Whitelist to prevent SSRF against internal/arbitrary hosts
        if (!ALLOWED_HOSTS.includes(url.hostname)) {
            return new Response('Access denied: Host not whitelisted', { status: 403 });
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

        // 3. Content-Type Validation: Ensure we're actually proxying an image
        if (!contentType || !contentType.startsWith('image/')) {
            return new Response('URL did not return a valid image', { status: 400 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
                // 4. Security Headers
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error: unknown) {
        // Fail securely: Don't leak internals or URL details in the response
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Image proxy error:', errorMessage);
        return new Response('Error fetching image', { status: 500 });
    }
}
