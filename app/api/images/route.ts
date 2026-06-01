
import { NextResponse } from 'next/server';

const ALLOWED_DOMAINS = ['streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const url = new URL(imageUrl);

        // Security checks: Only allow HTTPS and whitelisted domains
        if (url.protocol !== 'https:') {
            return new Response('Only HTTPS protocol is allowed', { status: 400 });
        }

        if (!ALLOWED_DOMAINS.includes(url.hostname)) {
            return new Response('Domain not allowed', { status: 403 });
        }

        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/'
            },
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000) // 5 second timeout to prevent hanging
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
                'X-Content-Type-Options': 'nosniff' // Prevent MIME-sniffing attacks
            },
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'TimeoutError') {
            return new Response('Request timed out', { status: 504 });
        }
        if (error instanceof TypeError && error.message.includes('Invalid URL')) {
            return new Response('Invalid URL format', { status: 400 });
        }
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
