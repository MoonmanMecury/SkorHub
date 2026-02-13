import { getUserProfile, getUserPayments } from '@/app/actions/user';
import { getSupporterStats } from '@/app/actions/support';
import Link from 'next/link';

export default async function AccountPage() {
    const profile = await getUserProfile();
    const payments = await getUserPayments(5, 0);
    const stats = await getSupporterStats();

    if (!profile) return null;

    const isPremium = profile.premium;
    const isSupporter = !!profile.supporter_tier;
    const isVIP = profile.supporter_tier === 'vip';

    // Format dates
    const memberSince = new Date(profile.created_at).toLocaleDateString();
    const supporterSince = profile.supporter_since ? new Date(profile.supporter_since).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : null;
    const nextRenewal = profile.supporter_expires_at ? new Date(profile.supporter_expires_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : null;

    return (
        <div className="max-w-7xl mx-auto pt-4 pb-20 space-y-10">
            {/* 1️⃣ Welcome Section (Visible to Everyone) */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">My Dashboard</h1>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                            {profile.email[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white font-bold">{profile.email.split('@')[0]}</p>
                            <div className="flex items-center gap-2">
                                {isVIP && <span className="text-[10px] font-black uppercase bg-gradient-to-r from-primary to-orange-500 text-white px-2 py-0.5 rounded-full tracking-wider">VIP Founder</span>}
                                {isSupporter && !isVIP && <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full tracking-wider">Community Supporter</span>}
                                {!isSupporter && <span className="text-[10px] font-black uppercase bg-white/10 text-slate-400 px-2 py-0.5 rounded-full tracking-wider">Free Member</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4">
                    <div className="glass px-4 py-2 rounded-xl border border-white/5 text-center min-w-[80px]">
                        <div className="text-xl font-black text-white">{profile.favorites_count || 0}</div>
                        <div className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Favorites</div>
                    </div>
                    <div className="glass px-4 py-2 rounded-xl border border-white/5 text-center min-w-[80px]">
                        <div className="text-xl font-black text-white">
                            {isVIP ? 'HD' : 'SD'}
                        </div>
                        <div className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Quality</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Priority Status */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 🆕 Mobile Only: Horizontal Nav Buttons ("Larger than Life") */}
                    <div className="lg:hidden flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 scrollbar-hide snap-x">
                        <Link href="/favorites" className="snap-center flex-none w-[140px] h-[140px] glass rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/5 active:scale-95 transition-all bg-[#161618]">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-icons text-3xl text-primary">favorite</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Favorites</span>
                        </Link>
                        <Link href="/billing" className="snap-center flex-none w-[140px] h-[140px] glass rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/5 active:scale-95 transition-all bg-[#161618]">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <span className="material-icons text-3xl text-emerald-500">volunteer_activism</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Donations</span>
                        </Link>
                        <Link href="/history" className="snap-center flex-none w-[140px] h-[140px] glass rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/5 active:scale-95 transition-all bg-[#161618]">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <span className="material-icons text-3xl text-blue-500">history</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">History</span>
                        </Link>
                    </div>

                    {/* 2️⃣ Support Status Card (The Identity Layer) */}
                    {isSupporter ? (
                        <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border ${isVIP ? 'border-orange-500/20 bg-gradient-to-br from-[#1a1a1c] to-black' : 'border-emerald-500/20 bg-[#161618]'}`}>
                            {/* Background Glow */}
                            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 ${isVIP ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-4xl md:text-5xl">{isVIP ? '⭐' : '🌟'}</span>
                                            <h2 className={`text-3xl md:text-5xl font-black uppercase italic tracking-tighter ${isVIP ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-200' : 'text-white'}`}>
                                                {isVIP ? 'VIP Founder' : 'Community Supporter'}
                                            </h2>
                                        </div>
                                        <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-lg">
                                            {isVIP
                                                ? "You're accelerating improvements for the whole community."
                                                : "You're helping keep SkorHub independent and ad-free."}
                                        </p>
                                    </div>
                                    <Link href="/support" className="px-6 py-3 glass border border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-widest text-white rounded-xl transition-all whitespace-nowrap">
                                        Manage Support
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 glass rounded-3xl border border-white/5 bg-black/20">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Supporting Since</p>
                                        <p className="text-white font-bold text-xl">{supporterSince || memberSince}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Next Renewal</p>
                                        <p className="text-white font-bold text-xl">{nextRenewal || 'Lifetime'}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Total Impact</p>
                                        <p className="text-emerald-400 font-bold text-xl">K{profile.total_donated || 0}</p>
                                    </div>
                                </div>

                                {/* Retention Message */}
                                <div className="mt-8 flex items-center gap-4">
                                    <div className="h-px bg-white/10 flex-1"></div>
                                    <p className="text-xs font-medium text-slate-500 italic">Thank you for believing in us ❤️</p>
                                    <div className="h-px bg-white/10 flex-1"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Non-Supporter View (The Nudge)
                        <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-white/10 bg-[#161618]">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="space-y-6 max-w-lg">
                                    <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">Become a Founder</h2>
                                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                        Join the community members who are building the future of Zambian sports streaming. Get ad-free access starting at just K15.
                                    </p>
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-bold uppercase tracking-wide">
                                            <span className="material-icons text-emerald-500">check_circle</span> No Ads
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-bold uppercase tracking-wide">
                                            <span className="material-icons text-emerald-500">check_circle</span> HD Priority
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href="/support"
                                    className="px-10 py-5 bg-primary hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all shadow-xl shadow-primary/20 whitespace-nowrap text-lg"
                                >
                                    Support Us
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* 3️⃣ Impact Section (Psychology Layer) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* ... Existing Impact & Goal code ... */}
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                <span className="material-icons text-sm">rocket_launch</span> {isSupporter ? "Your Impact" : "Community Impact"}
                            </h3>
                            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    {isSupporter ? "Recent improvements funded by you:" : "Recent improvements funded by supporters:"}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></span>
                                        <span className="text-sm text-slate-300">Servers upgraded for faster loading</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></span>
                                        <span className="text-sm text-slate-300">Added backup stream provider</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></span>
                                        <span className="text-sm text-slate-300">Reduced buffering by 22%</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 4️⃣ Community Funding Tracker */}
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                <span className="material-icons text-sm">trending_up</span> Community Goal
                            </h3>
                            <div className="glass p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-3xl font-black text-white">{Math.round(stats.progressPercent)}%</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">of monthly goal</span>
                                </div>
                                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-orange-500"
                                        style={{ width: `${Math.min(100, stats.progressPercent)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-slate-500">
                                    <span>Current: K{stats.monthlyRevenue.toFixed(0)}</span>
                                    <span>Goal: K{stats.monthlyGoal}</span>
                                </div>
                                <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                                    Every contribution helps us reach sustainability. No investors, just fans.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 5️⃣ Founder Updates */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <span className="material-icons text-sm">campaign</span> Platform Updates
                        </h3>
                        <div className="glass p-6 rounded-2xl border border-white/5">
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[60px] mt-1">Today</span>
                                    <div>
                                        <p className="text-sm text-white font-medium">New Supporter Dashboard launched</p>
                                        <p className="text-xs text-slate-500 mt-1">Total redesign to recognize our amazing community members.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[60px] mt-1">Feb 08</span>
                                    <div>
                                        <p className="text-sm text-white font-medium">Stream stability improved</p>
                                        <p className="text-xs text-slate-500 mt-1">Optimized player buffer settings for slower connections.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - Utility */}
                <div className="space-y-8">

                    {/* VIP Shortcuts (Desktop visible, mobile handled by top nav mostly) */}
                    {isVIP && (
                        <div className="hidden lg:block">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#FFD700] mb-4 flex items-center gap-2">
                                <span className="material-icons text-sm">star</span> VIP Quick Access
                            </h3>
                            <div className="space-y-3">
                                <Link href="/favorites" className="group flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:border-[#FFD700]/30 hover:bg-[#FFD700]/5 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700]">
                                            <span className="material-icons text-sm">favorite</span>
                                        </div>
                                        <span className="text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors">My Favorites</span>
                                    </div>
                                    <span className="material-icons text-slate-600 text-sm group-hover:text-[#FFD700] transform group-hover:translate-x-1 transition-all">arrow_forward</span>
                                </Link>
                                <Link href="/schedule" className="group flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <span className="material-icons text-sm">calendar_today</span>
                                        </div>
                                        <span className="text-sm font-bold text-white group-hover:text-blue-500 transition-colors">Upcoming Matches</span>
                                    </div>
                                    <span className="material-icons text-slate-600 text-sm group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Recent History */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <span className="material-icons text-sm">history</span> Recent Activity
                        </h3>
                        <div className="glass p-6 rounded-2xl border border-white/5 text-center py-10">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <span className="material-icons text-slate-600">movie</span>
                            </div>
                            <p className="text-sm text-slate-400">Watch history coming soon</p>
                        </div>
                    </div>

                    {/* Recent Payments (Responsive) */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <span className="material-icons text-sm">receipt</span> Donation History
                            </h3>
                            <Link href="/billing" className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">View All</Link>
                        </div>
                        {/* Mobile: Horizontal Scroll | Desktop: Vertical List */}
                        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                            {payments && payments.length > 0 ? (
                                <>
                                    {/* Mobile View */}
                                    <div className="md:hidden flex overflow-x-auto p-4 gap-4 scrollbar-hide snap-x">
                                        {payments.slice(0, 5).map((p: any) => (
                                            <div key={p.id} className="snap-center flex-none w-48 p-4 glass rounded-2xl border border-white/10 bg-[#161618]">
                                                <p className="text-lg font-black text-white mb-1">{p.currency} {p.amount}</p>
                                                <p className="text-[10px] text-slate-500 font-mono mb-2">{new Date(p.initiated_at).toLocaleDateString()}</p>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${p.status === 'success' || p.status === 'successful' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-500'}`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                        ))}
                                        <Link href="/billing" className="snap-center flex-none w-24 p-4 glass rounded-2xl border border-white/10 flex items-center justify-center bg-white/5">
                                            <span className="text-[10px] font-bold uppercase text-slate-400">View All</span>
                                        </Link>
                                    </div>
                                    {/* Desktop View */}
                                    <div className="hidden md:block divide-y divide-white/5">
                                        {payments.slice(0, 3).map((p: any) => (
                                            <div key={p.id} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                                <div>
                                                    <p className="text-xs font-bold text-white mb-0.5">{p.currency} {p.amount}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{new Date(p.initiated_at).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${p.status === 'success' || p.status === 'successful' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-500'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="p-6 text-center">
                                    <p className="text-xs text-slate-500 italic">No payment history</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
