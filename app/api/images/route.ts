
import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['streamed.pk', 'www.streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);

        // SSRF Mitigation: Enforce HTTPS protocol
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Invalid protocol', { status: 400 });
        }

        // SSRF Mitigation: Restrict hostnames to allowlisted sources
        if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
            return new Response('Forbidden host', { status: 403 });
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

        // Security: Ensure the remote response is actually an image
        if (!contentType || !contentType.startsWith('image/')) {
            return new Response('Invalid content type', { status: 400 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error: unknown) {
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
