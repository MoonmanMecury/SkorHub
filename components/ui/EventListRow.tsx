
'use client';

import Link from 'next/link';
import { useFavorites } from '@/hooks/use-favorites';

interface EventListRowProps {
    id: string;
    title: string;
    time: string;
    live?: boolean;
    category: string;
    homeBadge?: string;
    awayBadge?: string;
}

export function EventListRow({ id, title, time, live, category, homeBadge, awayBadge }: EventListRowProps) {
    const { isFavorited, toggleFavorite } = useFavorites();
    const isFav = isFavorited(id);

    return (
        <div className="group relative bg-[#161618]/40 hover:bg-[#161618] border border-white/5 hover:border-primary/20 rounded-2xl p-4 transition-all duration-300">
            <Link href={`/match/${id}`} className="flex flex-col md:flex-row items-center gap-6">
                {/* Time & Category */}
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1 min-w-[100px]">
                    <p className="text-white font-black text-sm italic group-hover:text-primary transition-colors">{time}</p>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{category}</span>
                </div>

                {/* Match Identity */}
                <div className="flex-1 flex items-center justify-center md:justify-start gap-6">
                    <h3 className="text-sm md:text-lg font-black uppercase italic tracking-tighter text-white group-hover:translate-x-1 transition-transform">
                        {title.split(' vs ')[0]}
                        <span className="text-primary NOT-italic mx-2 text-xs">VS</span>
                        {title.split(' vs ')[1]}
                    </h3>

                    {live && (
                        <span className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            Live
                        </span>
                    )}
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center -space-x-3 opacity-40 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1.5 backdrop-blur-sm">
                            <span className="material-icons text-xs">shield</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1.5 backdrop-blur-sm">
                            <span className="material-icons text-xs">shield</span>
                        </div>
                    </div>

                    <button className="px-6 py-2 bg-white/5 group-hover:bg-primary border border-white/10 group-hover:border-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                        Watch
                    </button>
                </div>
            </Link>

            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(id);
                }}
                className={`absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-2 ${isFav ? 'bg-primary text-white border-primary/50 opacity-100 translate-x-2' : 'bg-[#0A0A0B] text-slate-500 border-white/10'
                    }`}
            >
                <span className={`material-symbols-outlined text-sm ${isFav ? 'fill-current' : ''}`}>star</span>
            </button>
        </div>
    );
}
