
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
        const timer = setTimeout(() => {
            router.push(target);
        }, 3000);
        return () => clearTimeout(timer);
    }, [target, router]);

    return (
        <div
            className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center px-6"
            role="status"
            aria-live="polite"
        >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">info</span>
            </div>

            <div className="space-y-3">
                <h2 className="text-lg font-black uppercase italic tracking-tighter text-white leading-tight">
                    {message}
                </h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                    Redirecting...
                </p>
            </div>

            <div className="w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse w-full origin-left"></div>
            </div>
        </div>
    );
}
