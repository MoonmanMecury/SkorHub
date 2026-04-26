
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const url = new URL(imageUrl);

        // 1. Enforce HTTPS to prevent insecure connections
        if (url.protocol !== 'https:') {
            return new Response('Only HTTPS protocol is allowed', { status: 400 });
        }

        // 2. Hostname allowlist to prevent SSRF and credential leakage
        const allowedHostnames = ['streamed.pk'];
        const isSafeUrl = allowedHostnames.includes(url.hostname);

        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        // Only include API key for allowed hosts to prevent leakage to 3rd parties
        const headers: Record<string, string> = {
            'Accept': 'image/*',
            'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
        };

        if (isSafeUrl && apiKey) {
            headers['X-API-KEY'] = apiKey;
        }

        if (!isSafeUrl) {
            console.warn(`Blocked image proxy request to unauthorized host: ${url.hostname}`);
            return new Response('Unauthorized host', { status: 403 });
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
