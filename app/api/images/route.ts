
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        // SSRF Protection: Validate URL
        const parsedUrl = new URL(imageUrl);

        // Only allow HTTPS
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Invalid protocol', { status: 400 });
        }

        // Hostname whitelist - only allow streamed.pk
        const allowedHosts = ['streamed.pk'];
        if (!allowedHosts.includes(parsedUrl.hostname)) {
            return new Response('Unauthorized host', { status: 403 });
        }

        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
            },
            cache: 'no-cache',
            // Safety: timeout could be added here if fetch supported it directly in this env
        });

        if (!response.ok) {
            // Log details internally but return generic error to client
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            return new Response('Failed to retrieve image', { status: 502 });
        }

        const contentType = response.headers.get('Content-Type');

        // Security: Ensure we only return images
        if (!contentType || !contentType.startsWith('image/')) {
            console.error(`Invalid content type from ${imageUrl}: ${contentType}`);
            return new Response('Invalid content type', { status: 415 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
                'X-Content-Type-Options': 'nosniff'
            },
        });
    } catch (error: unknown) {
        // Distinguish between invalid URL and fetch errors
        if (error instanceof TypeError && error.message.includes('Invalid URL')) {
            return new Response('Invalid URL format', { status: 400 });
        }

        console.error('Image proxy error:', error);
        return new Response('Error processing image request', { status: 500 });
    }
}
