
import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);

        // Security Check: Only allow https and specific hostnames
        const isSafeProtocol = parsedUrl.protocol === 'https:';
        const isSafeHost = ALLOWED_HOSTS.includes(parsedUrl.hostname);

        if (!isSafeProtocol || !isSafeHost) {
            console.error(`Blocked suspicious image proxy request to: ${imageUrl}`);
            return new Response('Forbidden: Invalid protocol or hostname', { status: 403 });
        }

        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const headers: Record<string, string> = {
            'Accept': 'image/*',
            'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
        };

        // Only send API key to trusted hosts to prevent credential leakage via SSRF
        if (isSafeHost && apiKey) {
            headers['X-API-KEY'] = apiKey;
        }

        const response = await fetch(imageUrl, {
            headers,
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
    } catch (error: unknown) {
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
