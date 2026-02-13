
'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import { streamedApi } from '@/lib/streamed';
import { cleanupFavoritesAction } from '@/app/actions/favorites';
import { MatchCard } from '../ui/MatchCard';
import { Match } from '@/types';
import Link from 'next/link';

export function FavoritesGrid() {
    const { favorites, isLoaded } = useFavorites();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && favorites.length > 0) {
            // Lazy background cleanup of stale entries
            cleanupFavoritesAction();
        }
    }, [isLoaded, favorites.length]);

    useEffect(() => {
        async function loadMatches() {
            try {
                const allMatches = await streamedApi.getAllMatches();
                const favMatches = allMatches.filter(m => favorites.includes(m.id));
                setMatches(favMatches);
            } catch (error) {
                console.error('Failed to load favorite matches:', error);
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded) {
            loadMatches();
        }
    }, [favorites, isLoaded]);

    if (!isLoaded || loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-video bg-[#161618] animate-pulse rounded-[1.5rem] border border-white/5"></div>
                ))}
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="bg-[#161618] border border-white/5 p-20 rounded-[2.5rem] text-center space-y-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-xl">
                    <span className="material-icons text-5xl text-slate-700">stars</span>
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Your list is empty</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 mb-6">Star your must-watch matches to see them here.</p>
                    <Link href="/" className="px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl">
                        Find Matches
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map(match => (
                <MatchCard
                    key={match.id}
                    team1={match.teams.home.name}
                    team2={match.teams.away.name}
                    meta={`${match.sportCategory} • ${new Date(match.date).toLocaleDateString()}`}
                    live={match.live}
                    matchId={match.id}
                    posterUrl={match.poster}
                    homeBadge={match.teams.home.badge}
                    awayBadge={match.teams.away.badge}
                />
            ))}
        </div>
    );
}
