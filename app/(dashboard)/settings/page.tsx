import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className="max-w-7xl mx-auto pt-4 pb-20 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block animate-pulse">Configuration</span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Account <span className="text-primary NOT-italic">Settings</span></h1>
                    <p className="text-slate-500 font-medium mt-2">Manage your preferences, security, and privacy options.</p>
                </div>
                <Link href="/account" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    <span className="material-icons text-sm">arrow_back</span>
                    Back to Dashboard
                </Link>
            </header>

            <div className="flex flex-col items-center justify-center py-20 bg-[#161618] border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent blur-3xl"></div>

                <div className="relative z-10 text-center max-w-lg mx-auto space-y-8 px-6">
                    <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                        <span className="material-icons text-5xl text-slate-500 animate-spin-slow">settings</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Under Construction</h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            We're building robust controls to put you in charge. New settings features are being rolled out soon.
                        </p>
                    </div>

                    <div className="space-y-3 w-full max-w-sm mx-auto">
                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 opacity-50">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-slate-500">notifications</span>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Notifications</span>
                            </div>
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Pending</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 opacity-50">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-slate-500">privacy_tip</span>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Privacy</span>
                            </div>
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Pending</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 opacity-50">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-slate-500">security</span>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Security</span>
                            </div>
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Pending</span>
                        </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                        <p className="text-primary text-xs font-bold uppercase tracking-widest">
                            <span className="material-icons text-sm align-middle mr-2">engineering</span>
                            Expected Launch: March 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
