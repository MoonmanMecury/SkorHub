import { getPublicSupporters, getSupporterStats } from '@/app/actions/support';
import Link from 'next/link';

export const metadata = {
    title: 'Our Supporters | SkorHub',
    description: 'Thank you to all the amazing supporters helping us build SkorHub. We appreciate every single one of you!',
};

export default async function SupportersPage() {
    const supporters = await getPublicSupporters();
    const stats = await getSupporterStats();

    const vipSupporters = supporters.filter(s => s.tier === 'vip');
    const regularSupporters = supporters.filter(s => s.tier === 'supporter');
    const oneTimeDonors = supporters.filter(s => s.tier === 'one-time');

    return (
        <div className="min-h-screen bg-background-dark">
            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                        Thank You to Our <span className="text-primary italic">Supporters</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        These amazing people are helping us build the best sports streaming directory for Zambia.
                        We couldn't do this without you! 🙏
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                        <div className="text-4xl font-black text-primary mb-2">{stats.totalSupporters}</div>
                        <div className="text-sm font-bold uppercase text-slate-500 tracking-widest">Total Supporters</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                        <div className="text-4xl font-black text-orange-500 mb-2">{stats.vipCount}</div>
                        <div className="text-sm font-bold uppercase text-slate-500 tracking-widest">VIP Members</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                        <div className="text-4xl font-black text-emerald-500 mb-2">K{stats.totalRaised.toFixed(0)}</div>
                        <div className="text-sm font-bold uppercase text-slate-500 tracking-widest">Total Raised</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                        <div className="text-4xl font-black text-white mb-2">{Math.round(stats.progressPercent)}%</div>
                        <div className="text-sm font-bold uppercase text-slate-500 tracking-widest">Monthly Goal</div>
                    </div>
                </div>

                {/* VIP Supporters */}
                {vipSupporters.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase text-white">VIP Supporters</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {vipSupporters.map((supporter, index) => (
                                <div key={index} className="glass p-4 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center text-white font-black text-lg">
                                            {supporter.display_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-white truncate">{supporter.display_name}</div>
                                            <div className="text-xs text-slate-500 font-medium">
                                                K{parseFloat(supporter.total_donated).toFixed(0)} donated
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Regular Supporters */}
                {regularSupporters.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🌟</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase text-white">Supporters</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {regularSupporters.map((supporter, index) => (
                                <div key={index} className="glass p-4 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all text-center">
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-white font-black text-lg mx-auto mb-2">
                                        {supporter.display_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="font-bold text-white text-sm truncate">{supporter.display_name}</div>
                                    <div className="text-xs text-slate-500 font-medium">
                                        K{parseFloat(supporter.total_donated).toFixed(0)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* One-Time Donors */}
                {oneTimeDonors.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">☕</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase text-white">One-Time Contributors</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {oneTimeDonors.map((supporter, index) => (
                                <div key={index} className="glass px-4 py-2 rounded-xl border border-white/5 hover:border-blue-500/20 transition-all">
                                    <span className="font-bold text-white text-sm">{supporter.display_name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {supporters.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="material-icons text-slate-600 text-4xl">favorite_border</span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">Be the First Supporter!</h3>
                        <p className="text-slate-400 mb-6">Help us get started by becoming our first supporter.</p>
                        <Link
                            href="/support"
                            className="inline-block px-8 py-4 bg-primary hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all shadow-lg shadow-primary/20"
                        >
                            Support SkorHub
                        </Link>
                    </div>
                )}

                {/* CTA */}
                <div className="glass p-10 rounded-[2.5rem] border border-white/5 text-center mt-16">
                    <h3 className="text-3xl font-black uppercase text-white mb-4">Want to Join Them?</h3>
                    <p className="text-slate-400 font-medium mb-6 max-w-2xl mx-auto">
                        Every supporter helps us build better features, improve performance, and work toward licensed, ad-free streams.
                    </p>
                    <Link
                        href="/support"
                        className="inline-block px-10 py-5 bg-primary hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all shadow-xl shadow-primary/40"
                    >
                        Become a Supporter
                    </Link>
                </div>

                {/* Note */}
                <p className="text-center text-xs text-slate-600 font-medium mt-8">
                    Don't want to be listed? You can update your preferences in your account settings.
                </p>
            </div>
        </div>
    );
}
