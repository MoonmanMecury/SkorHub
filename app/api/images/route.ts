
import { NextResponse } from 'next/server';
import { isValidImageHost } from '@/lib/security';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    // 1. SSRF Protection: Validate the hostname
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(imageUrl);
    } catch {
        return new Response('Invalid URL format', { status: 400 });
    }

    if (!isValidImageHost(imageUrl)) {
        console.warn(`Blocked potentially malicious image proxy request to: ${imageUrl}`);
        return new Response('Unauthorized image host', { status: 400 });
    }

    try {
        const apiKey = process.env.IMAGES_API_KEY;

        // 2. DoS Protection: Implement a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(imageUrl, {
            headers: {
                // Only send API key to the primary trusted source - strict hostname check
                'X-API-KEY': (parsedUrl.hostname === 'streamed.pk' || parsedUrl.hostname.endsWith('.streamed.pk'))
                    ? (apiKey || '')
                    : '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/'
            },
            cache: 'no-cache',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            return new Response(`Remote server returned ${response.status}`, { status: response.status });
        }

        const contentType = response.headers.get('Content-Type');

        // Basic type validation
        if (contentType && !contentType.startsWith('image/')) {
             return new Response('Remote server did not return an image', { status: 400 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return new Response('Request timed out', { status: 504 });
        }
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
