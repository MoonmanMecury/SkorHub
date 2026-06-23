
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

        if (url.protocol !== 'https:') {
            return new Response('Only HTTPS protocol is allowed', { status: 400 });
        }

        if (!ALLOWED_HOSTS.includes(url.hostname)) {
            return new Response('Hostname not whitelisted', { status: 400 });
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
            // Secure error handling - don't leak remote server details
            return new Response('Failed to fetch image from remote server', { status: 400 });
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.startsWith('image/')) {
            return new Response('URL did not resolve to a valid image', { status: 400 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch {
        // Secure error handling: If URL parsing fails or other error occurs, return generic error
        return new Response('Invalid URL or error fetching image', { status: 400 });
    }
}
