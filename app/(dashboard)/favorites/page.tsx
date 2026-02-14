import { FavoritesGrid } from '@/components/favorites/FavoritesGrid';
import { isVIPSupporter } from '@/app/actions/support';
import Link from 'next/link';
import { getSession } from '@/lib/auth'; // Ensure user is logged in first

export const dynamic = 'force-dynamic';


export default async function FavoritesPage() {
    const session = await getSession();

    // If not logged in, they will likely be redirected by middleware, but good to handle
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-black text-white">Please Sign In</h1>
                <Link href="/sign-in?returnUrl=/favorites" className="px-6 py-3 bg-primary text-white font-bold rounded-lg">Sign In</Link>
            </div>
        );
    }

    const isVIP = await isVIPSupporter();

    if (!isVIP) {
        return (
            <div className="max-w-7xl mx-auto pt-4 pb-20 space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Locked Feature</span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white opacity-50">My Favorites</h1>
                    </div>
                </header>

                <div className="flex flex-col items-center justify-center py-20 bg-[#161618] border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent blur-3xl"></div>

                    <div className="relative z-10 text-center max-w-lg mx-auto space-y-8 px-6">
                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 group relative">
                            <span className="material-icons text-5xl text-slate-600 group-hover:text-orange-500 transition-colors">lock</span>
                            <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-2 shadow-lg">
                                <span className="material-icons text-sm">star</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">VIP Exclusive</h2>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                The Favorites feature is exclusively for our VIP Founders. Track your teams, get notifications, and organize your viewing experience.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-left bg-black/20 p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-orange-500 text-sm">check_circle</span>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Pin favorite matches</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-orange-500 text-sm">check_circle</span>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Get match alerts (Coming Soon)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-orange-500 text-sm">check_circle</span>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Support the platform</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <Link href="/support" className="block w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-lg">
                                Become a VIP
                            </Link>
                            <Link href="/account" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pt-4 pb-20 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block animate-pulse">Your Collection</span>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">My Favorites</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">All your curated live events and upcoming matches in one place</p>
                </div>
                <div className="flex items-center gap-4 bg-[#161618] border border-white/5 px-6 py-4 rounded-2xl shadow-xl">
                    <span className="material-icons text-primary">notifications_active</span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Sync Active</p>
                </div>
            </header>

            <FavoritesGrid />
        </div>
    );
}
