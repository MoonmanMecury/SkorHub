
import { getUserPayments, getUserProfile } from '@/app/actions/user';
import Link from 'next/link';

export const dynamic = 'force-dynamic';


export default async function BillingPage() {
    const profile = await getUserProfile();
    const payments = await getUserPayments(50, 0); // Get up to 50 recent payments
    const supporterTier = profile?.supporter_tier;

    if (!profile) return null;

    return (
        <div className="max-w-7xl mx-auto pt-4 pb-20 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block animate-pulse">Community Support</span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Donation <span className="text-primary NOT-italic">History</span></h1>
                    <p className="text-slate-500 font-medium mt-2">Track your contributions to the SkorHub community.</p>
                </div>
                <Link href="/account" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    <span className="material-icons text-sm">arrow_back</span>
                    Back to Dashboard
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Status Highlights */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#161618] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                        <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-4">Current Status</h3>
                            {supporterTier ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${supporterTier === 'vip' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                            <span className="material-icons">{supporterTier === 'vip' ? 'star' : 'volunteer_activism'}</span>
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-white italic">{supporterTier === 'vip' ? 'VIP Founder' : 'Community Supporter'}</p>
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Supporter</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-2xl font-black text-white decoration-wavy underline decoration-primary/30">K{profile.total_donated || 0}</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lifetime Contribution</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/10">
                                            <span className="material-icons">favorite_border</span>
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-white italic">Free Member</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Active Contribution</p>
                                        </div>
                                    </div>
                                    <Link href="/support" className="w-full py-4 bg-primary text-white font-black uppercase rounded-2xl text-center block text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                        Become a Supporter
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#161618] border border-white/5 rounded-[2.5rem] p-8">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-6">Your Impact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4">
                                <span className="material-icons text-sm text-emerald-500">check_circle</span>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">Helping keep servers running</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="material-icons text-sm text-emerald-500">check_circle</span>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">Supporting independent media</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="material-icons text-sm text-emerald-500">check_circle</span>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">Funding future features</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Detailed Payment Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#161618] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h2 className="text-lg font-black uppercase italic tracking-tighter text-white">Donation Record</h2>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{payments?.length || 0} Transactions</span>
                        </div>

                        {/* Mobile Card View (Responsive) */}
                        <div className="md:hidden space-y-4 p-6">
                            {payments && payments.length > 0 ? payments.map((p: any) => (
                                <div key={p.id} className="bg-black/20 border border-white/5 rounded-3xl p-6 space-y-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Amount</p>
                                            <p className="text-2xl font-black text-white italic">{p.currency} {p.amount}</p>
                                        </div>
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${p.status === 'successful' || p.status === 'success' || p.status === 'completed'
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : p.status === 'failed'
                                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 relative z-10">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Date</p>
                                            <p className="text-xs font-bold text-slate-300">
                                                {new Date(p.initiated_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Reference</p>
                                            <p className="text-[10px] font-mono text-slate-400 break-all">{p.reference}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center border border-white/5 rounded-3xl bg-black/20">
                                    <p className="text-xs font-black uppercase text-slate-600 tracking-widest">No donations found</p>
                                </div>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#1a1a1c] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    <tr>
                                        <th className="px-8 py-5">Reference</th>
                                        <th className="px-8 py-5">Method</th>
                                        <th className="px-8 py-5">Amount</th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                        <th className="px-8 py-5 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {payments && payments.length > 0 ? payments.map((p: any) => (
                                        <tr key={p.id} className="text-sm font-medium hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-mono text-xs">{p.reference}</span>
                                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Lenco ID: {p.lenco_reference || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 decoration-primary decoration-2 group-hover:underline">
                                                    {p.payment_method?.replace('-', ' ') || 'Online'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-black text-white italic">{p.currency} {p.amount}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${p.status === 'successful' || p.status === 'success' || p.status === 'completed'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                    : p.status === 'failed'
                                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right text-slate-500 font-bold text-xs">
                                                {new Date(p.initiated_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-700">
                                                        <span className="material-icons text-4xl">volunteer_activism</span>
                                                    </div>
                                                    <p className="text-slate-500 font-black uppercase italic tracking-widest text-xs">No donations found yet</p>
                                                    <Link href="/support" className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline">Support the mission</Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-8 bg-white/[0.01] border-t border-white/5 text-center">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Thank you for your support. Questions? Email donations@skorhub.com.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
