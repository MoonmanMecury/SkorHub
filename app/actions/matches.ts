
// app/actions/matches.ts
'use server'

import { streamedApi } from '@/lib/streamed';

export async function fetchLiveMatches() {
    return await streamedApi.getLiveMatches();
}
export async function fetchAllMatches() {
    return await streamedApi.getAllMatches();
}

export async function fetchMatch(id: string) {
    // Run both checks in parallel to minimize latency
    const [allMatches, liveMatches] = await Promise.all([
        streamedApi.getAllMatches(),
        streamedApi.getLiveMatches().catch(() => [])
    ]);

    const normalize = (val: any) => String(val).toLowerCase();
    const targetId = normalize(id);

    const match = allMatches.find((m: any) => normalize(m.id) === targetId) ||
        liveMatches.find((m: any) => normalize(m.id) === targetId);

    return match || null;
}

export async function getStreamsAction(source: string, id: string) {
    if (!source || !id) return [];
    return await streamedApi.getStream(source, id);
}

export async function searchMatchesAction(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const matches = await streamedApi.getAllMatches();
        const normalize = (s: string) => s.toLowerCase().trim();
        const q = normalize(query);

        return matches.filter(m =>
            normalize(m.title).includes(q) ||
            normalize(m.sportCategory).includes(q) ||
            normalize(m.teams?.home?.name || '').includes(q) ||
            normalize(m.teams?.away?.name || '').includes(q)
        ).slice(0, 8); // Return 8 results for quick search
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}
