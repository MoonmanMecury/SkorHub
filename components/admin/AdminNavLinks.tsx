'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavLinks({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/admin') return pathname === '/admin';
        return pathname.startsWith(path);
    };

    const linkClass = (path: string) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive(path)
            ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)] border border-amber-500/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
        }`;

    const iconClass = (path: string) => `material-icons text-xl ${isActive(path) ? 'text-amber-500' : 'text-slate-500 group-hover:text-white'
        }`;

    return (
        <nav className="space-y-2">
            <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</div>

            <Link href="/admin" onClick={onItemClick} className={linkClass('/admin')}>
                <span className={iconClass('/admin')}>dashboard</span>
                <span>Overview</span>
            </Link>

            <Link href="/admin/users" onClick={onItemClick} className={linkClass('/admin/users')}>
                <span className={iconClass('/admin/users')}>people</span>
                <span>User Management</span>
            </Link>

            <Link href="/admin/payments" onClick={onItemClick} className={linkClass('/admin/payments')}>
                <span className={iconClass('/admin/payments')}>payments</span>
                <span>Transactions</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-white/5">
                <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Content & Support</div>

                <Link href="/admin/feedback" onClick={onItemClick} className={linkClass('/admin/feedback')}>
                    <span className={iconClass('/admin/feedback')}>mail</span>
                    <span>Feedback Inbox</span>
                </Link>

                <Link href="/admin/content" onClick={onItemClick} className={linkClass('/admin/content')}>
                    <span className={iconClass('/admin/content')}>edit_document</span>
                    <span>Site Content</span>
                </Link>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5">
                <Link href="/admin/settings" onClick={onItemClick} className={linkClass('/admin/settings')}>
                    <span className={iconClass('/admin/settings')}>admin_panel_settings</span>
                    <span>Admin Settings</span>
                </Link>

                <Link href="/account" onClick={onItemClick} className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-slate-400 hover:bg-white/5 hover:text-white border border-transparent">
                    <span className="material-icons text-xl text-slate-500">exit_to_app</span>
                    <span>Exit Admin</span>
                </Link>
            </div>
        </nav>
    );
}
