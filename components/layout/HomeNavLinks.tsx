'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomeNavLinks({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const links = [
        { href: '/', label: 'Home', icon: 'home' },
        { href: '/schedule', label: 'Schedule', icon: 'calendar_today' },
        { href: '/favorites', label: 'Favorites', icon: 'star' },
        { href: '/support', label: 'Support', icon: 'favorite' },
        { href: '/status', label: 'Status', icon: 'monitor_heart' },
    ];

    return (
        <nav className="space-y-2">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={onItemClick}
                    className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive(link.href)
                            ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(239,68,68,0.1)] border border-primary/20'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                >
                    <span className={`material-icons text-xl ${isActive(link.href) ? 'text-primary' : 'text-slate-500 group-hover:text-white'}`}>{link.icon}</span>
                    <span>{link.label}</span>
                </Link>
            ))}
        </nav>
    );
}
