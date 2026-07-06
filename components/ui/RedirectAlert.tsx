
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

    const handleRedirect = () => {
        router.push(target);
    };

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-white/5 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-black text-primary italic">{seconds}</span>
                </div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>

            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white mb-2 max-w-md">
                {message}
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                Automatic redirection in {seconds} seconds...
            </p>

            <button
                onClick={handleRedirect}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 group"
            >
                Redirect Now
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
        </div>
    );
}
