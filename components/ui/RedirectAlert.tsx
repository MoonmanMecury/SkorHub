
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
        if (seconds === 0) {
            router.push(target);
        }
    }, [seconds, target, router]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 p-6 text-center" role="alert" aria-live="polite">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-white/5 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-primary">{seconds}</span>
                </div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div className="max-w-md">
                <p className="text-white font-bold text-lg mb-2">{message}</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest">
                    Redirecting to {target === '/schedule' ? 'Schedule' : 'Home'} in {seconds}s...
                </p>
            </div>

            <button
                onClick={() => router.push(target)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B] outline-none"
            >
                Redirect Now
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
        </div>
    );
}
