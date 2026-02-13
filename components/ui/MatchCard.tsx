
'use client';

import Link from 'next/link';
import { FallbackImage } from './FallbackImage';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/hooks/use-auth';

interface MatchCardProps {
    team1: string;
    team2: string;
    meta: string;
    live?: boolean;
    viewers?: string;
    matchId: string;
    posterUrl?: string; // Optional poster if available
    homeBadge?: string;
    awayBadge?: string;
}

export function MatchCard({ team1, team2, meta, live, viewers, matchId, posterUrl, homeBadge, awayBadge }: MatchCardProps) {
    const { isFavorited, toggleFavorite } = useFavorites();
    const { user } = useAuth();
    const isFav = isFavorited(matchId);
    const isPremium = user?.premium;

    return (
        <div className="w-full group relative block">
            <Link href={`/match/${matchId}`} className="cursor-pointer">
                <div className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-[#161618] border border-white/5 transition-all group-hover:border-primary/30 group-hover:shadow-[0_10px_40px_rgba(239,68,68,0.1)]">
                    {posterUrl ? (
                        <img src={posterUrl} alt={`${team1} vs ${team2}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <FallbackImage seed={matchId} className="w-full h-full" />
                    )}

                    {/* Team Badges Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-6 pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105">
                        {homeBadge && (
                            <div className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center p-2.5 shadow-2xl">
                                <img src={homeBadge} alt={team1} className="w-full h-full object-contain" />
                            </div>
                        )}

                        {!posterUrl && homeBadge && awayBadge && (
                            <span className="text-white font-black text-xl italic select-none opacity-40 animate-pulse">VS</span>
                        )}

                        {awayBadge && (
                            <div className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center p-2.5 shadow-2xl">
                                <img src={awayBadge} alt={team2} className="w-full h-full object-contain" />
                            </div>
                        )}
                    </div>

                    {live && (
                        <div className="absolute top-3 left-3 flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black text-white z-20 shadow-lg tracking-widest uppercase">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
                        </div>
                    )}
                    {viewers && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-slate-300 flex items-center gap-1.5 z-20 border border-white/5">
                            {isPremium && <span className="text-primary italic mr-1">PRO</span>}
                            <span className="material-icons text-[12px] text-primary">visibility</span> {viewers}
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                </div>
            </Link>

            {/* Favorite Button - Separate from Link */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(matchId);
                }}
                className={`absolute bottom-16 right-4 z-30 w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-2xl border ${isFav
                    ? 'bg-primary text-white border-primary/50'
                    : 'bg-black/60 text-white/50 border-white/10 hover:border-primary/50 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100'
                    }`}
            >
                <span className={`material-symbols-outlined text-xl ${isFav ? 'fill-current' : ''}`}>
                    {isFav ? 'star' : 'star'}
                </span>
            </button>

            <div className="mt-4 px-1">
                <h4 className="font-black text-sm uppercase italic tracking-tight group-hover:text-primary transition-colors text-white line-clamp-1">{team1} <span className="text-primary NOT-italic">vs</span> {team2}</h4>
                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest leading-none flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-slate-800"></span> {meta}
                </p>
            </div>
        </div>
    );
}
