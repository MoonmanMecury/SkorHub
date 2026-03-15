
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    // Security check: validate the URL to prevent SSRF
    try {
        const parsedUrl = new URL(imageUrl);

        // Only allow HTTPS
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Only HTTPS protocol is allowed', { status: 400 });
        }

        // Restrict to trusted domains only
        const allowedHosts = ['streamed.pk'];
        if (!allowedHosts.includes(parsedUrl.hostname)) {
            console.error(`Security blocked: Attempted SSRF to unauthorized host ${parsedUrl.hostname}`);
            return new Response('Unauthorized host', { status: 403 });
        }
    } catch {
        return new Response('Invalid URL parameter', { status: 400 });
    }

    try {
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
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Image proxy error:', errorMessage);
        return new Response('Error fetching image', { status: 500 });
    }
}
