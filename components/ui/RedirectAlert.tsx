'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Info, ArrowRight } from 'lucide-react';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const timer = setTimeout(() => {
                router.push(target);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [target, router]);

    const getTargetName = (path: string) => {
        if (path === '/') return 'Home';
        if (path === '/schedule') return 'Schedule';
        if (path === '/favorites') return 'Favorites';
        // Fallback: capitalize first letter of the path
        return path.replace('/', '').charAt(0).toUpperCase() + path.slice(2) || 'Home';
    };

    const targetName = getTargetName(target);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/10">
                <Info className="text-primary w-8 h-8" />
            </div>

            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-3 italic">Redirecting...</h2>
            <p className="text-slate-400 text-sm max-w-sm mb-8 font-medium leading-relaxed">
                {message}
            </p>

            <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Heading to {targetName} in a moment
                    </p>
                </div>

                <Link
                    href={target}
                    className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <span>Click here to go now</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
