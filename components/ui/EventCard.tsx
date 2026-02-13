'use client';

import Link from 'next/link';
import { FallbackImage } from './FallbackImage';
import { useFavorites } from '@/hooks/use-favorites';

interface EventCardProps {
    title: string;
    time: string;
    live?: boolean;
    imgUrl: string;
    id: string;
}

export function EventCard({ title, time, live, imgUrl, id }: EventCardProps) {
    const { isFavorited, toggleFavorite } = useFavorites();
    const isFav = isFavorited(id);
    const hasImage = imgUrl && !imgUrl.includes('placehold.co');

    return (
        <div className="block group relative">
            <Link href={`/match/${id}`} className="cursor-pointer">
                <div className="relative aspect-[16/10] bg-[#161618] rounded-2xl overflow-hidden mb-3 border border-white/5 transition-all group-hover:border-primary/20 group-hover:scale-[1.02] shadow-lg">
                    {hasImage ? (
                        <img alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" src={imgUrl} />
                    ) : (
                        <FallbackImage seed={id} className="w-full h-full" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-60"></div>

                    {live && (
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-primary px-2 py-0.5 rounded-lg text-[8px] font-black text-white uppercase tracking-tighter shadow-xl">
                            <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span> Live
                        </div>
                    )}
                </div>
            </Link>

            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(id);
                }}
                className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-xl border flex items-center justify-center transition-all z-20 ${isFav
                    ? 'bg-primary text-white border-primary/50'
                    : 'bg-black/40 text-white/50 border-white/10 hover:text-yellow-400 backdrop-blur-md opacity-0 group-hover:opacity-100'
                    }`}
            >
                <span className={`material-symbols-outlined text-[16px] ${isFav ? 'fill-current' : ''}`}>
                    {isFav ? 'star' : 'star'}
                </span>
            </button>

            <div className="px-1">
                <h5 className="text-[11px] font-black uppercase italic tracking-tight line-clamp-1 text-white group-hover:text-primary transition-colors">{title}</h5>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-[1px] bg-slate-800"></span>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{time}</p>
                </div>
            </div>
        </div>
    );
}
