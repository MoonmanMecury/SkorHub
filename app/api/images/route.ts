import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = (process.env.ALLOWED_IMAGE_HOSTS || 'streamed.pk')
    .split(',')
    .map(host => host.trim().toLowerCase());

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);

        // 1. Enforce HTTPS
        if (parsedUrl.protocol !== 'https:') {
            return NextResponse.json({ error: 'Only HTTPS protocol is allowed' }, { status: 400 });
        }

        // 2. Whitelist hostname
        if (!ALLOWED_HOSTS.includes(parsedUrl.hostname.toLowerCase())) {
            return NextResponse.json({ error: 'Domain not whitelisted' }, { status: 403 });
        }

        const apiKey = process.env.IMAGES_API_KEY;
        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': apiKey || '',
                'Accept': 'image/*',
                'Referer': 'https://streamed.pk/'
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Remote server returned ${response.status}` },
                { status: response.status }
            );
        }

        // 3. Validate Content-Type
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.startsWith('image/')) {
            return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
                'X-Content-Type-Options': 'nosniff'
            },
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return NextResponse.json({ error: 'Invalid URL or fetch error' }, { status: 400 });
    }
}
