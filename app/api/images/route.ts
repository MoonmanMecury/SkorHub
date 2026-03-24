
import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['streamed.pk', 'www.streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) return new Response('Missing URL parameter', { status: 400 });

    try {
        const parsedUrl = new URL(imageUrl);

        // 🛡️ Sentinel: Enforce HTTPS and whitelist hostnames to prevent SSRF and secret leakage
        if (parsedUrl.protocol !== 'https:') {
            return new Response('Only HTTPS is allowed', { status: 400 });
        }

        if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
            return new Response('Forbidden hostname', { status: 403 });
        }

        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': process.env.IMAGES_API_KEY || '',
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
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch {
        // 🛡️ Sentinel: Fail securely and don't leak internal error details
        return new Response('Error fetching image', { status: 500 });
    }
}
