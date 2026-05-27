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
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Only HTTPS protocol is allowed', { status: 400 });
        }
        if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
            return new Response('Forbidden: domain not whitelisted', { status: 403 });
        }

        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': process.env.IMAGES_API_KEY || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/'
            },
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            return new Response(`Remote server returned ${response.status}`, { status: response.status });
        }

        const contentType = response.headers.get('Content-Type') || 'image/jpeg';
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
                'X-Content-Type-Options': 'nosniff'
            },
        });
    } catch (error: unknown) {
        const isTimeout = error instanceof Error && error.name === 'TimeoutError';
        return new Response(isTimeout ? 'Request timed out' : 'Error fetching image', {
            status: isTimeout ? 504 : 500
        });
    }
}
