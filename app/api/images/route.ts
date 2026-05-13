
import { NextResponse } from 'next/server';
import { isSafeUrl } from '@/lib/security';

const ALLOWED_IMAGE_DOMAINS = ['streamed.pk'];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) return new Response('Missing URL', { status: 400 });

    if (!isSafeUrl(imageUrl, ALLOWED_IMAGE_DOMAINS)) {
        return new Response('Forbidden', { status: 403 });
    }

    try {
        const response = await fetch(imageUrl, {
            headers: {
                'X-API-KEY': process.env.IMAGES_API_KEY || '',
                'Referer': 'https://streamed.pk/'
            },
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) return new Response('Remote Error', { status: response.status });

        const arrayBuffer = await response.arrayBuffer();
        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch {
        return new Response('Fetch Error', { status: 500 });
    }
}
