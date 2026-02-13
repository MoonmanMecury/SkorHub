
'use client';

import { useState } from 'react';
import { EventCard } from '@/components/ui/EventCard';
import { EventListRow } from '@/components/ui/EventListRow';
import { Match } from '@/types';

interface ScheduleClientProps {
    groupedMatches: { [key: string]: Match[] };
    sortedDates: string[];
}

export function ScheduleClient({ groupedMatches, sortedDates }: ScheduleClientProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="space-y-16">
            {/* View Switcher Controls */}
            <div className="flex items-center justify-between sticky top-20 z-30 bg-background-dark/80 backdrop-blur-md py-4 px-2 -mx-2 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Display Format</p>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            <span className="material-icons text-sm">grid_view</span>
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            <span className="material-icons text-sm">format_list_bulleted</span>
                            List
                        </button>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Live Matches Prioritized
                </div>
            </div>

            <div className="space-y-20">
                {sortedDates.map((dateLabel) => (
                    <section key={dateLabel} className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-1 bg-primary rounded-full"></div>
                            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">{dateLabel}</h2>
                            <div className="flex-1 h-[1px] bg-white/5"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{groupedMatches[dateLabel].length} Matches</span>
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                {groupedMatches[dateLabel].map((match) => (
                                    <EventCard
                                        key={match.id}
                                        id={match.id}
                                        title={`${match.teams.home.name} vs ${match.teams.away.name}`}
                                        time={new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        live={match.live}
                                        imgUrl={match.poster}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {groupedMatches[dateLabel].map((match) => (
                                    <EventListRow
                                        key={match.id}
                                        id={match.id}
                                        title={`${match.teams.home.name} vs ${match.teams.away.name}`}
                                        category={match.sportCategory}
                                        time={new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        live={match.live}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}
