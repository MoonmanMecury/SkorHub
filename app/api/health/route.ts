
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    const status: any = {
        database: 'Checking...',
        api: 'Checking...',
        match_test: null,
        timestamp: new Date().toISOString()
    };

    try {
        // DB Check
        const dbStart = Date.now();
        await db.query('SELECT 1');
        status.database = `Connected (${Date.now() - dbStart}ms)`;
    } catch (err: any) {
        status.database = `Failed: ${err.message}`;
    }

    try {
        const apiStart = Date.now();
        const res = await fetch('https://streamed.pk/api/matches/all', { next: { revalidate: 0 } });
        if (res.ok) {
            const data = await res.json();
            status.api = `UP (${Date.now() - apiStart}ms)`;
            if (Array.isArray(data) && data.length > 0) {
                const first = data[0];
                status.match_test = {
                    id: first.id,
                    title: first.title,
                    has_poster: !!first.poster,
                    poster_url: first.poster ? (first.poster.startsWith('http') ? 'Valid' : 'Invalid format') : 'Missing'
                };
            }
        } else {
            status.api = `DOWN (${res.status})`;
        }
    } catch (err: any) {
        status.api = `Error: ${err.message}`;
    }

    return NextResponse.json(status);
}
