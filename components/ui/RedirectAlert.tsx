
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
            }, 3000); // 3 seconds to ensure they can read the full message
            return () => clearTimeout(timer);
        }
    }, [target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 px-6 text-center max-w-lg mx-auto" role="status" aria-live="polite">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-white/5 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-icons text-primary/40">info</span>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">
                    {message}
                </h2>
                <div className="flex flex-col items-center gap-3">
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.25em] animate-pulse">
                        Redirecting to {target === '/schedule' ? 'Schedule' : 'Home'}
                    </p>
                </div>
            </div>
        </div>
    );
}
