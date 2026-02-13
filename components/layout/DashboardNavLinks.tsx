'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardNavLinks({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname();
    const { user } = useAuth();

    const isActive = (path: string) => {
        if (path === '/account') return pathname === '/account';
        return pathname.startsWith(path);
    };

    return (
        <nav className="space-y-2">
            <Link
                href="/account"
                onClick={onItemClick}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive('/account')
                    ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(239,68,68,0.1)] border border-primary/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
            >
                <span className={`material-icons text-xl ${isActive('/account') ? 'text-primary' : 'text-slate-500 group-hover:text-white'}`}>dashboard</span>
                <span>Dashboard</span>
            </Link>

            <Link
                href="/favorites"
                onClick={onItemClick}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive('/favorites')
                    ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(239,68,68,0.1)] border border-primary/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
            >
                <span className={`material-icons text-xl ${isActive('/favorites') ? 'text-primary' : 'text-slate-500 group-hover:text-white'}`}>favorite</span>
                <span>Favorites</span>
            </Link>

            <Link
                href="/billing"
                onClick={onItemClick}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive('/billing')
                    ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(239,68,68,0.1)] border border-primary/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
            >
                <span className={`material-icons text-xl ${isActive('/billing') ? 'text-primary' : 'text-slate-500 group-hover:text-white'}`}>volunteer_activism</span>
                <span>Donations</span>
            </Link>

            <Link
                href="/history"
                onClick={onItemClick}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive('/history')
                    ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(239,68,68,0.1)] border border-primary/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
            >
                <span className={`material-icons text-xl ${isActive('/history') ? 'text-primary' : 'text-slate-500 group-hover:text-white'}`}>history</span>
                <span>History</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
                <Link
                    href="/settings"
                    onClick={onItemClick}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive('/settings')
                        ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(239,68,68,0.1)] border border-primary/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                >
                    <span className={`material-icons text-xl ${isActive('/settings') ? 'text-primary' : 'text-slate-500 group-hover:text-white'}`}>settings</span>
                    <span>Settings</span>
                </Link>

                {user?.is_admin && (
                    <Link
                        href="/admin"
                        onClick={onItemClick}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-black mt-2"
                    >
                        <span className="material-icons text-xl">admin_panel_settings</span>
                        <span>Admin Panel</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
