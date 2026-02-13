
import { Match, Stream, Sport } from '@/types';

const BASE_URL = 'https://streamed.pk/api';

// Helper to determine live status (mimics apiController.js logic)
function isMatchLive(match: any): boolean {
    if (!match.date) return false;
    const now = Date.now();
    const matchTime = match.date;

    // Consider live if match started within last 4 hours
    // Also consider live if starting within next 10 minutes? The original logic was:
    // matchTime <= now && (now - matchTime) <= 4h
    // This means it only considers matches ALREADY started. 
    // Maybe we want upcoming matches too? For now adhering to original logic.
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    return matchTime <= now && (now - matchTime) <= fourHoursInMs;
}

function enrichMatch(match: any): Match {
    const homeBadgeId = match.teams?.home?.badge;
    const awayBadgeId = match.teams?.away?.badge;

    // Standardized Image API paths
    const homeBadgeUrl = homeBadgeId ? `https://streamed.pk/api/images/badge/${homeBadgeId}.webp` : null;
    const awayBadgeUrl = awayBadgeId ? `https://streamed.pk/api/images/badge/${awayBadgeId}.webp` : null;

    // Poster logic based on docs: badge/badge or direct proxy
    let posterUrl = '';
    if (homeBadgeId && awayBadgeId) {
        posterUrl = `https://streamed.pk/api/images/poster/${homeBadgeId}/${awayBadgeId}.webp`;
    } else if (match.poster) {
        // If it's already a full path or just an ID
        const posterId = match.poster.replace('/api/images/proxy/', '').replace('.webp', '');
        posterUrl = `https://streamed.pk/api/images/proxy/${posterId}.webp`;
    }

    return {
        id: String(match.id),
        title: match.title,
        date: match.date,
        poster: posterUrl,
        popular: match.popular || false,
        sources: match.sources || [],
        teams: {
            home: {
                name: match.teams?.home?.name || 'Home',
                badge: homeBadgeUrl as string
            },
            away: {
                name: match.teams?.away?.name || 'Away',
                badge: awayBadgeUrl as string
            }
        },
        sportCategory: match.category || 'unknown',
        live: isMatchLive(match)
    };
}

export const streamedApi = {

    getAllMatches: async (): Promise<Match[]> => {
        try {
            const res = await fetch(`${BASE_URL}/matches/all`, { next: { revalidate: 60 } });
            if (!res.ok) throw new Error('Failed to fetch matches');
            const data = await res.json();
            return Array.isArray(data) ? data.map(enrichMatch) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getLiveMatches: async (): Promise<Match[]> => {
        try {
            const res = await fetch(`${BASE_URL}/matches/live`, { next: { revalidate: 30 } }); // shorter cache for live
            if (!res.ok) throw new Error('Failed to fetch live matches');
            const data = await res.json();
            // Original controller forced live=true for this endpoint
            return Array.isArray(data) ? data.map(m => ({ ...enrichMatch(m), live: true })) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getTodayMatches: async (): Promise<Match[]> => {
        try {
            const res = await fetch(`${BASE_URL}/matches/all-today`, { next: { revalidate: 60 } });
            if (!res.ok) throw new Error('Failed to fetch today matches');
            const data = await res.json();
            return Array.isArray(data) ? data.map(enrichMatch) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getMatchesBySport: async (sport: string): Promise<Match[]> => {
        try {
            const res = await fetch(`${BASE_URL}/matches/${sport}`, { next: { revalidate: 60 } });
            if (!res.ok) throw new Error(`Failed to fetch ${sport} matches`);
            const data = await res.json();
            return Array.isArray(data) ? data.map(enrichMatch) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getStream: async (source: string, id: string): Promise<Stream[]> => {
        try {
            const res = await fetch(`${BASE_URL}/stream/${source}/${id}`, { cache: 'no-store' }); // Don't cache stream links as tokens might expire
            if (!res.ok) throw new Error('Failed to fetch stream');
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getSports: async (): Promise<Sport[]> => {
        try {
            const res = await fetch(`${BASE_URL}/sports`, { next: { revalidate: 3600 } });
            if (!res.ok) throw new Error('Failed to fetch sports');
            return await res.json();
        } catch (error) {
            // Fallback static list based on standard sports
            return [
                { id: 'football', name: 'Football', icon: 'sports_soccer' },
                { id: 'basketball', name: 'Basketball', icon: 'sports_basketball' },
                { id: 'american-football', name: 'Amer. Football', icon: 'sports_football' },
                { id: 'hockey', name: 'Hockey', icon: 'sports_hockey' },
                { id: 'baseball', name: 'Baseball', icon: 'sports_baseball' },
                { id: 'motor-sports', name: 'Motor Sports', icon: 'sports_motorsports' },
                { id: 'fight', name: 'Fighting', icon: 'sports_mma' },
                { id: 'tennis', name: 'Tennis', icon: 'sports_tennis' },
                { id: 'rugby', name: 'Rugby', icon: 'sports_rugby' },
                { id: 'cricket', name: 'Cricket', icon: 'sports_cricket' },
                { id: 'golf', name: 'Golf', icon: 'sports_golf' },
                { id: 'other', name: 'Other', icon: 'emoji_events' }
            ];
        }
    }
};
