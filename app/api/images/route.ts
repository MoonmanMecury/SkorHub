import { NextResponse } from 'next/server';

const ALLOWED_DOMAINS = ['streamed.pk'];
const FETCH_TIMEOUT = 5000; // 5 seconds

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);

        // 1. SSRF Protection: Validate domain and protocol
        if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
             return new Response('Invalid protocol', { status: 400 });
        }

        if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
            return new Response('Forbidden: Domain not allowed', { status: 403 });
        }

        // 2. Timeout protection to prevent DoS
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        // 3. API Key Leakage Protection: Only send key to trusted domains
        // (Currently ALLOWED_DOMAINS only contains streamed.pk)
        const apiKey = process.env.IMAGES_API_KEY;
        const headers: Record<string, string> = {
            'Accept': 'image/*',
            'Referer': 'https://streamed.pk/'
        };

        if (apiKey && ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
            headers['X-API-KEY'] = apiKey;
        }

        const response = await fetch(imageUrl, {
            headers,
            cache: 'no-cache',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

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
        if (error instanceof Error && error.name === 'AbortError') {
            return new Response('Request timed out', { status: 504 });
        }
        console.error('Image proxy error:', error);
        return new Response('Error fetching image', { status: 500 });
    }
}
