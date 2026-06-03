
import { NextResponse } from 'next/server';

const ALLOWED_DOMAINS = ['streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(imageUrl);
    } catch {
        return new Response('Invalid URL format', { status: 400 });
    }

    // Security: Only allow http or https to prevent other protocols (e.g., file://, gopher://)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return new Response('Invalid protocol', { status: 400 });
    }

    // Security: Validate domain against whitelist to prevent SSRF
    if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
        return new Response('Disallowed domain', { status: 400 });
    }

    try {
        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        // Security: Use parsedUrl.toString() to ensure consistency and avoid parser differential attacks
        const response = await fetch(parsedUrl.toString(), {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            // Security: Return a generic message and 502 status to avoid leaking remote server details or status codes
            console.error(`Failed to fetch image from ${parsedUrl.hostname}: ${response.status}`);
            return new Response('Failed to fetch image from remote server', { status: 502 });
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
        return new Response('Error processing image request', { status: 500 });
    }
}
