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
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push(target);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <span className="material-icons text-primary text-3xl">info</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">{message}</h2>
            <p className="text-slate-400 text-sm font-medium mb-8">
                Redirecting you in <span className="text-primary font-bold">{seconds}s</span>...
            </p>
            <button
                onClick={() => router.push(target)}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                Redirect Now
                <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
        </div>
    );
}
