
import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = ['streamed.pk', 'www.streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    try {
        const url = new URL(imageUrl);

        // Security: Whitelist hostnames and enforce HTTPS
        if (!ALLOWED_HOSTS.includes(url.hostname)) {
            return NextResponse.json({ error: 'Forbidden: Host not whitelisted' }, { status: 403 });
        }

        if (url.protocol !== 'https:') {
            return NextResponse.json({ error: 'Forbidden: HTTPS required' }, { status: 403 });
        }

        // We use the IMAGES_API_KEY from .env.local if available
        const apiKey = process.env.IMAGES_API_KEY;

        const response = await fetch(url.toString(), {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/' // Common requirement for sports streamers
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
            return NextResponse.json({ error: `Remote server returned ${response.status}` }, { status: response.status });
        }

        const contentType = response.headers.get('Content-Type');

        // Security: Validate Content-Type is actually an image
        if (!contentType || !contentType.startsWith('image/')) {
            console.error(`Invalid Content-Type from ${imageUrl}: ${contentType}`);
            return NextResponse.json({ error: 'Forbidden: Invalid content type' }, { status: 403 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error: unknown) {
        console.error('Image proxy error:', error);
        return NextResponse.json({ error: 'Error fetching image' }, { status: 500 });
    }
}
