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

        // 🛡️ Sentinel: SSRF protection - restrict to allowed hosts and HTTPS
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Only HTTPS protocol is allowed', { status: 400 });
        }

        if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
            return new Response('Invalid hostname', { status: 403 });
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

        // 🛡️ Sentinel: Ensure the response is actually an image
        if (!contentType || !contentType.startsWith('image/')) {
            return new Response('Invalid content type', { status: 415 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error: unknown) {
        // 🛡️ Sentinel: Handle invalid URLs gracefully
        if (error instanceof TypeError && error.message.includes('Invalid URL')) {
            return new Response('Invalid URL format', { status: 400 });
        }
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
