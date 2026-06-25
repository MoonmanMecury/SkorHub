
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push(target);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-8" role="alert" aria-live="polite">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <span className="absolute inset-0 flex items-center justify-center font-black text-2xl text-primary">{seconds}</span>
            </div>
            <div className="max-w-md space-y-3">
                <p className="text-white font-black text-xl uppercase italic tracking-tight">{message}</p>
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] opacity-80 animate-pulse">
                    Auto-redirecting in {seconds} seconds...
                </p>
            </div>
            <button
                onClick={() => router.push(target)}
                className="group flex items-center gap-3 px-8 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95"
            >
                Redirect Now
                <span className="material-icons text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
        </div>
    );
}
