'use client';

import Link from 'next/link';

interface SportsGridProps {
    sports?: { id: string, name: string, icon: string }[];
}

export function SportsGrid({ sports }: SportsGridProps) {
    const list = sports || [
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
    ];

    return (
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-6">
            {list.map((cat, i) => (
                <Link key={i} href={`/category/${cat.id}`} className="flex-none group cursor-pointer block">
                    <div className="w-36 h-36 bg-[#161618] rounded-[2rem] flex flex-col items-center justify-center border border-white/5 group-hover:border-primary/50 group-hover:shadow-[0_10px_40px_rgba(239,68,68,0.15)] transition-all duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xl">
                            <span className="material-icons text-3xl text-slate-500 group-hover:text-primary transition-colors">{cat.icon}</span>
                        </div>
                        <span className="relative z-10 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">{cat.name}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
