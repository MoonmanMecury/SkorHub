
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    // SSRF Prevention: Validate URL and Hostname
    let validatedUrl: URL;
    try {
        validatedUrl = new URL(imageUrl);
        if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
            return new Response('Invalid protocol', { status: 400 });
        }

        const allowedHostnames = ['streamed.pk', 'www.streamed.pk'];
        const isAllowedHost = allowedHostnames.some(host =>
            validatedUrl.hostname === host || validatedUrl.hostname.endsWith('.' + host)
        );

        if (!isAllowedHost) {
            console.warn(`SSRF Prevention: Blocked request to untrusted host: ${validatedUrl.hostname}`);
            return new Response('Untrusted hostname', { status: 403 });
        }
    } catch {
        return new Response('Invalid URL format', { status: 400 });
    }

    try {
        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(validatedUrl.toString(), {
            headers: {
                // Only send API key to trusted host
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
