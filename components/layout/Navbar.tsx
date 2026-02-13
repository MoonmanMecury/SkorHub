'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import { SearchBar } from './SearchBar';
import MobileNav from './MobileNav';

export default function Navbar() {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 glass-nav border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <MobileNav navType="home" />
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            <span className="material-icons text-white text-2xl">play_circle</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter italic uppercase text-white hidden sm:block">SkorHub</span>
                    </Link>
                </div>

                {/* Nav Links - Hidden on mobile */}
                <nav className="hidden lg:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                    <Link className={`${pathname === '/' ? 'text-primary' : 'hover:text-primary transition-colors'}`} href="/">Home</Link>
                    <Link className={`${pathname === '/favorites' ? 'text-primary' : 'hover:text-primary transition-colors'}`} href="/favorites">Favorites</Link>
                    <Link className={`${pathname === '/schedule' ? 'text-primary' : 'hover:text-primary transition-colors'}`} href="/schedule">Schedule</Link>
                    <Link className={`${pathname === '/support' ? 'text-primary' : 'hover:text-primary transition-colors'}`} href="/support">❤️ Support</Link>
                    <Link className={`${pathname === '/status' ? 'text-primary' : 'hover:text-primary transition-colors'}`} href="/status">Status</Link>
                </nav>

                {/* Search Bar - Centered on mobile, normal on desktop */}
                <div className="flex-1 max-w-[150px] sm:max-w-xs md:max-w-md">
                    <SearchBar />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {user?.is_admin && (
                        <Link href="/admin" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 hover:text-black transition-all shadow-lg shadow-amber-500/5 mr-2">
                            <span className="material-icons text-sm">admin_panel_settings</span>
                            Admin
                        </Link>
                    )}

                    {!loading && !user?.premium && !user?.supporter_tier && (
                        <Link href="/support" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5">
                            <span className="material-icons text-sm">favorite</span>
                            Support Us
                        </Link>
                    )}

                    {!loading && (
                        user ? (
                            <Link href="/account" className="flex items-center gap-3 pl-3 border-l border-white/10 group">
                                <div className="text-right hidden lg:block">
                                    <div className="flex items-center gap-2 justify-end">
                                        <p className="text-[10px] font-black text-white uppercase tracking-tight">{user.email.split('@')[0]}</p>
                                        {user.supporter_tier === 'vip' && <span className="text-xs">⭐</span>}
                                        {user.supporter_tier === 'supporter' && <span className="text-xs">🌟</span>}
                                    </div>
                                    <p className={`text-[8px] font-black uppercase tracking-widest ${user.premium ? 'text-emerald-500' :
                                        user.supporter_tier === 'vip' ? 'text-orange-500' :
                                            user.supporter_tier === 'supporter' ? 'text-emerald-400' :
                                                'text-slate-500'
                                        }`}>
                                        {user.premium ? 'Premium Elite' :
                                            user.supporter_tier === 'vip' ? 'VIP Supporter' :
                                                user.supporter_tier === 'supporter' ? 'Supporter' :
                                                    'Free Member'}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-[#161618] border border-white/10 flex items-center justify-center text-xs font-black text-primary group-hover:border-primary/50 transition-all shadow-xl">
                                    {user.email[0].toUpperCase()}
                                </div>
                            </Link>
                        ) : (
                            <Link href="/sign-in" className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all">
                                Sign In
                            </Link>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}
