import { streamedApi } from '@/lib/streamed';
import { EventCard } from '@/components/ui/EventCard';
import Link from 'next/link';
import { RedirectAlert } from '@/components/ui/RedirectAlert';

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch sports to get the proper name
    const sports = await streamedApi.getSports();
    const sport = sports.find(s => s.id.toLowerCase() === id.toLowerCase());
    const sportName = sport ? sport.name : id.toUpperCase();

    // Fetch matches for this sport
    const allMatches = await streamedApi.getAllMatches();
    const matches = allMatches.filter(m => m.sportCategory.toLowerCase() === id.toLowerCase());

    if (matches.length === 0) {
        return <RedirectAlert message={`No active ${sportName} matches found at this moment. Redirecting to global schedule...`} target="/schedule" />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <span className="material-icons text-slate-400">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">{sportName}</h1>
                    <p className="text-slate-500 text-sm font-medium">Showing all live and upcoming {sportName} matches</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {matches.map(match => (
                    <EventCard
                        key={match.id}
                        id={match.id}
                        title={`${match.teams.home.name} vs ${match.teams.away.name}`}
                        time={new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        live={match.live}
                        imgUrl={match.poster || 'https://placehold.co/600x400/1e1e21/FFF?text=No+Image'}
                    />
                ))}
            </div>
        </div>
    );
}
