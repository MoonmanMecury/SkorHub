
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
    // streamedApi doesn't have a single match fetch by ID yet, usually it gets all and filters
    const matches = await streamedApi.getAllMatches();
    // Sometimes IDs are strings, sometimes numbers in APIs. convert to string for safety
    const match = matches.find((m: any) => String(m.id) === String(id));

    if (!match) {
        // Double check live matches if not found in main list (sometimes APIs separate them)
        const live = await streamedApi.getLiveMatches();
        return live.find((m: any) => String(m.id) === String(id)) || null;
    }
    return match;
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
