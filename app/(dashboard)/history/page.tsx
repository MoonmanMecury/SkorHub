import Link from 'next/link';

export default function HistoryPage() {
    return (
        <div className="max-w-7xl mx-auto pt-4 pb-20 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block animate-pulse">VIP Feature</span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Watch <span className="text-orange-500 NOT-italic">History</span></h1>
                    <p className="text-slate-500 font-medium mt-2">Resume where you left off or find that great match you watched.</p>
                </div>
                <Link href="/account" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    <span className="material-icons text-sm">arrow_back</span>
                    Back to Dashboard
                </Link>
            </header>

            <div className="flex flex-col items-center justify-center py-20 bg-[#161618] border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent blur-3xl"></div>

                <div className="relative z-10 text-center max-w-lg mx-auto space-y-8 px-6">
                    <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                        <span className="material-icons text-5xl text-slate-500">schedule</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Coming Soon</h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            We're building a powerful way for you to track every match you watch. This feature will be available exclusively for our VIP Supporters.
                        </p>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                        <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">
                            <span className="material-icons text-sm align-middle mr-2">build_circle</span>
                            Currently in Development
                        </p>
                    </div>

                    <div className="pt-8">
                        <Link href="/support" className="inline-block px-8 py-4 bg-white text-black font-black uppercase rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-lg">
                            Support Construction
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
