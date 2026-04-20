
// app/actions/matches.ts
'use server'

import { streamedApi } from '@/lib/streamed';
import { Match } from '@/types';

export async function fetchLiveMatches() {
    return await streamedApi.getLiveMatches();
}
export async function fetchAllMatches() {
    return await streamedApi.getAllMatches();
}

export async function fetchMatch(id: string) {
    // streamedApi.getAllMatches() includes all matches (live and upcoming)
    // Fetching both is redundant and increases latency.
    const allMatches = await streamedApi.getAllMatches();

    const normalize = (val: string | number) => String(val).toLowerCase();
    const targetId = normalize(id);

    return allMatches.find((m: Match) => normalize(m.id) === targetId) || null;
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
