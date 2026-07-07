'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (seconds === 0) {
            router.push(target);
        }
    }, [seconds, target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-white/5 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{seconds}</span>
                </div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>

            <h2 className="text-xl font-black uppercase italic tracking-tight text-white mb-2">Redirecting Shortly</h2>
            <p className="text-slate-400 font-medium max-w-xs mx-auto text-[11px] uppercase tracking-widest leading-relaxed mb-8">
                {message}
            </p>

            <button
                onClick={() => router.push(target)}
                className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-primary/20 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark outline-none"
            >
                Redirect Now
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
        </div>
    );
}
