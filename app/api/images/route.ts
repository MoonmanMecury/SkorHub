
import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['streamed.pk'];

function isValidImageUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        // Only allow HTTPS
        if (parsedUrl.protocol !== 'https:') return false;

        // Check if hostname is allowed or is a subdomain of an allowed host
        return ALLOWED_HOSTS.some(host =>
            parsedUrl.hostname === host || parsedUrl.hostname.endsWith('.' + host)
        );
    } catch {
        return false;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    if (!isValidImageUrl(imageUrl)) {
        console.warn(`Blocked unauthorized image proxy request: ${imageUrl}`);
        return new Response('Unauthorized image source', { status: 403 });
    }

    try {
        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                // Only include the API key if it exists and the URL is trusted
                ...(apiKey ? { 'X-API-KEY': apiKey } : {}),
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
    } catch (error) {
        console.error('Image proxy error:', error instanceof Error ? error.message : error);
        return new Response('Error fetching image', { status: 500 });
    }
}
