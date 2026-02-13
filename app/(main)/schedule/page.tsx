
import { streamedApi } from '@/lib/streamed';
import Link from 'next/link';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';

import { ScheduleClient } from '@/components/schedule/ScheduleClient';

export default async function SchedulePage() {
    const allMatches = await streamedApi.getAllMatches();

    if (!allMatches || allMatches.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons text-slate-700 text-5xl">event_busy</span>
                </div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-4">No Matches Scheduled</h1>
                <p className="text-slate-500 font-medium mb-8">Check back later for upcoming live events and streams.</p>
                <Link href="/" className="px-8 py-4 bg-primary text-white font-black uppercase rounded-2xl text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all inline-block">
                    Return Home
                </Link>
            </div>
        );
    }

    // Group matches by date
    const grouped = allMatches.reduce((acc: { [key: string]: any[] }, match) => {
        const date = new Date(match.date);
        const dateString = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

        // Help with "Today" and "Tomorrow" labels
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        let label = dateString;
        if (date.toDateString() === today.toDateString()) label = "Today's Events";
        else if (date.toDateString() === tomorrow.toDateString()) label = "Tomorrow's Schedule";

        if (!acc[label]) acc[label] = [];
        acc[label].push(match);
        return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => {
        // Simple logic: "Today" first, then "Tomorrow", then rest
        if (a === "Today's Events") return -1;
        if (b === "Today's Events") return 1;
        if (a === "Tomorrow's Schedule") return -1;
        if (b === "Tomorrow's Schedule") return 1;
        return 0; // Keep alphabetical for rest
    });

    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-20 space-y-16">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">Global Broadcast Calendar</span>
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">Full <span className="text-primary NOT-italic">Schedule</span></h1>
                    <p className="text-slate-500 font-medium mt-3 max-w-xl">Browse all upcoming and ongoing live sports events. Never miss a kick-off with our real-time updated timetable.</p>
                </div>
                <div className="flex items-center gap-4 bg-[#161618] border border-white/5 rounded-2xl p-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Timezone</span>
                        <span className="text-[10px] font-bold text-white uppercase">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                    </div>
                    <span className="material-icons text-slate-700">schedule</span>
                </div>
            </header>

            <AdPlaceholder id="schedule-top-ad" />

            <ScheduleClient groupedMatches={grouped} sortedDates={sortedDates} />

            {/* Bottom Ad / Banner */}
            <div className="bg-gradient-to-br from-[#161618] to-black border border-white/5 rounded-[3rem] p-12 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Experience Sports in Ultra HD</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">Tired of lag and low resolution? Upgrade to Pro and watch matches in crystal clear 4K quality with no ads.</p>
                    <Link href="/subscribe" className="inline-block px-10 py-4 bg-white text-black font-black uppercase rounded-2xl text-[10px] tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-2xl">
                        Explore Premium Plans
                    </Link>
                </div>
            </div>
        </div>
    );
}
