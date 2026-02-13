
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchMatchesAction } from '@/app/actions/matches';
import { Match } from '@/types';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Match[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsSearching(true);
                const data = await searchMatchesAction(query);
                setResults(data);
                setIsSearching(false);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (matchId: string) => {
        setIsOpen(false);
        setQuery('');
        router.push(`/match/${matchId}`);
    };

    return (
        <div className="flex-1 max-w-md relative" ref={dropdownRef}>
            <div className={`relative group transition-all duration-300 ${isOpen ? 'scale-[1.02]' : ''}`}>
                <span className={`material-icons absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors duration-300 ${isSearching ? 'text-primary animate-spin' : 'text-slate-500 group-hover:text-primary'}`}>
                    {isSearching ? 'sync' : 'search'}
                </span>
                <input
                    className={`w-full bg-[#161618] border rounded-2xl py-2.5 pl-12 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-white placeholder-slate-600 outline-none ${isOpen ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-white/5'}`}
                    placeholder="Search events, teams or live matches..."
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full mt-3 w-full bg-[#161618] border border-white/10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-3 bg-white/[0.02] border-b border-white/5">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Match Results</p>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {results.length > 0 ? (
                            results.map((match) => (
                                <button
                                    key={match.id}
                                    onClick={() => handleSelect(match.id)}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left group/item"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                        <span className="material-icons text-lg">
                                            {match.live ? 'live_tv' : 'schedule'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-white uppercase italic tracking-tighter truncate max-w-[200px]">
                                                {match.teams?.home?.name} vs {match.teams?.away?.name}
                                            </p>
                                            {match.live && (
                                                <span className="text-[8px] font-black text-primary uppercase animate-pulse">Live</span>
                                            )}
                                        </div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                                            {match.sportCategory} • {new Date(match.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-10 text-center">
                                <span className="material-icons text-slate-700 text-4xl mb-3">search_off</span>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No matches found</p>
                                <p className="text-[10px] text-slate-600 mt-1 uppercase">Try searching for a different team or sport</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-white/[0.02] border-t border-white/5 text-center">
                        <Link href="/" onClick={() => setIsOpen(false)} className="text-[9px] font-black text-primary hover:underline uppercase tracking-widest">View All Matches</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

import Link from 'next/link';
