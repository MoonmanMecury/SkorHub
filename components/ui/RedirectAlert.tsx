
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps {
    message: string;
    target: string;
    delay?: number;
}

export function RedirectAlert({ message, target, delay = 3000 }: RedirectAlertProps) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(Math.ceil(delay / 1000));

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => Math.max(0, prev - 1));
        }, 1000);

        const redirectTimeout = setTimeout(() => {
            router.push(target);
        }, delay);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [target, router, delay]);

    return (
        <div
            className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
            role="status"
            aria-live="polite"
        >
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-primary font-black text-xl">{countdown}</span>
                </div>
            </div>

            <h2 className="text-white text-xl font-black uppercase tracking-tighter mb-3">
                {message}
            </h2>

            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
                Redirecting to {target === '/schedule' ? 'Schedule' : 'Home'} in {countdown}s...
            </p>

            <button
                onClick={() => router.push(target)}
                className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all"
            >
                Click here to skip
            </button>
        </div>
    );
}
