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
        if (seconds === 0) router.push(target);
    }, [seconds, router, target]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="max-w-md bg-[#161618] border border-white/10 rounded-[2rem] p-8 shadow-2xl space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-3xl text-primary animate-pulse">info</span>
                </div>
                <div className="space-y-2">
                    <p className="text-white font-bold text-lg leading-relaxed">{message}</p>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
                        Redirecting in <span className="text-primary font-black tabular-nums">{seconds}s</span>
                    </p>
                </div>
                <button
                    onClick={() => router.push(target)}
                    className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                    Redirect Now <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
