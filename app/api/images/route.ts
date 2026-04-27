import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['streamed.pk'];

/**
 * Image Proxy Route
 * Prevents SSRF and credential leakage by validating the destination URL
 * and ensuring the API key is only sent to trusted hostnames.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    let url: URL;
    try {
        url = new URL(imageUrl);
    } catch {
        return new Response('Invalid URL format', { status: 400 });
    }

    // 1. Protocol validation: Enforce HTTPS to prevent cleartext leakage and SSRF to local services
    if (url.protocol !== 'https:') {
        return new Response('Invalid protocol. Only https is allowed.', { status: 400 });
    }

    // 2. Hostname validation: Restrict to allowed streamers to prevent SSRF
    if (!ALLOWED_HOSTS.includes(url.hostname)) {
        return new Response('Disallowed hostname', { status: 403 });
    }

    try {
        // We use the IMAGES_API_KEY from .env.local if available
        // It is now safe to append the key as the hostname is validated
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/'
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            return new Response(`Remote server returned ${response.status}`, { status: response.status });
        }

        const contentType = response.headers.get('Content-Type');

        // 3. Basic Content-Type validation to ensure we only proxy images
        if (contentType && !contentType.startsWith('image/')) {
             return new Response('Resource is not an image', { status: 400 });
        }

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
