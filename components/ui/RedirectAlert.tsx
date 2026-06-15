'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (countdown <= 0) {
            router.push(target);
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, router, target]);

    const handleRedirect = () => {
        router.push(target);
    };

    return (
        <div
            className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
            role="alert"
            aria-live="polite"
        >
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-white/5 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-primary italic">{countdown}</span>
                </div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>

            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white mb-2">
                Wait a second...
            </h2>

            <p className="max-w-md text-slate-400 font-bold text-sm mb-8">
                {message}
            </p>

            <button
                onClick={handleRedirect}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
            >
                Redirect Now
            </button>

            <p className="mt-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Redirecting to {target === '/schedule' ? 'Schedule' : 'Home'} in {countdown}s
            </p>
        </div>
    );
}
