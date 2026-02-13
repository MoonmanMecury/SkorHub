
import Link from 'next/link';
import { streamedApi } from '@/lib/streamed';
import { SportsGrid } from '@/components/ui/SportsGrid';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';

export default async function Home() {
    const liveMatches = await streamedApi.getLiveMatches();
    const allMatches = await streamedApi.getAllMatches();
    const sports = await streamedApi.getSports();

    // Group matches by category
    const matchesByCategory = allMatches.reduce((acc: { [key: string]: any[] }, match) => {
        const cat = match.sportCategory.toLowerCase();
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(match);
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 space-y-12">

            {/* Disclaimer / Info */}
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
                <span className="material-icons text-primary">info</span>
                <p className="text-sm font-medium text-primary">
                    Important: Please use the official mirrors to access original stream URLs.
                    <Link href="#" className="underline font-bold ml-1">Click here to explore mirrors.</Link>
                </p>
                <button className="ml-auto text-primary/60 hover:text-primary">
                    <span className="material-icons">close</span>
                </button>
            </div>

            {/* Hero Banner / Ad Slot */}
            <AdPlaceholder id="home-hero-ad" />

            {/* Categories Grid (Quick Access) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black uppercase tracking-tighter">Sports Categories</h2>
                </div>
                <SportsGrid />
            </section>

            {/* Popular Live Section */}
            {liveMatches.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-primary rounded-full"></div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Live Now</h2>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded animate-pulse">On Air</span>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 snap-x">
                        {liveMatches.map(match => (
                            <div key={match.id} className="snap-center flex-none w-[85vw] max-w-sm">
                                <MatchCard
                                    team1={match.teams.home.name}
                                    team2={match.teams.away.name}
                                    meta={`${match.sportCategory} • LIVE`}
                                    live={true}
                                    viewers="Live"
                                    matchId={match.id}
                                    posterUrl={match.poster}
                                    homeBadge={match.teams.home.badge}
                                    awayBadge={match.teams.away.badge}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Dynamic Sections per Sport */}
            {sports.map(sport => {
                const sportMatches = matchesByCategory[sport.id.toLowerCase()] || [];
                if (sportMatches.length === 0) return null;

                return (
                    <section key={sport.id}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="material-icons text-primary">{sport.icon || 'sports'}</span>
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">{sport.name}</h2>
                            </div>
                            <Link href={`/category/${sport.id}`} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                                View All
                            </Link>
                        </div>

                        <div className="flex overflow-x-auto snap-x hide-scrollbar -mx-4 px-4 gap-4 pb-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:gap-4 sm:pb-0 sm:mx-0 sm:px-0">
                            {sportMatches.slice(0, 12).map(match => (
                                <div key={match.id} className="snap-center flex-none w-64 max-w-[80vw] sm:w-auto sm:max-w-none">
                                    <EventCard
                                        id={match.id}
                                        title={`${match.teams.home.name} vs ${match.teams.away.name}`}
                                        time={new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        live={match.live}
                                        imgUrl={match.poster || 'https://placehold.co/600x400/1e1e21/FFF?text=No+Image'}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* All Remaining Events (Catch-all) */}
            <section>
                <div className="flex items-center justify-between mb-6 border-l-4 border-primary pl-4">
                    <h2 className="text-xl font-black uppercase tracking-tighter">Upcoming & Recent</h2>
                    <Link href="/schedule" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Full Schedule</Link>
                </div>
                <div className="flex overflow-x-auto snap-x hide-scrollbar -mx-4 px-4 gap-4 pb-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:gap-4 sm:pb-0 sm:mx-0 sm:px-0">
                    {allMatches.filter(m => !liveMatches.find(l => l.id === m.id)).slice(0, 18).map(match => (
                        <div key={match.id} className="snap-center flex-none w-64 max-w-[80vw] sm:w-auto sm:max-w-none">
                            <EventCard
                                id={match.id}
                                title={`${match.teams.home.name} vs ${match.teams.away.name}`}
                                time={new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                live={match.live}
                                imgUrl={match.poster || 'https://placehold.co/600x400/1e1e21/FFF?text=No+Image'}
                            />
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}


// Component imports at bottom to avoid circular dep issues in some Next.js versions/configs if in same file
import { MatchCard } from '@/components/ui/MatchCard';
import { EventCard } from '@/components/ui/EventCard';
