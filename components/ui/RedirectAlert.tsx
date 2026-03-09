
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
        const timer = setInterval(() => {
            setCountdown((prev) => {
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

    const handleSkip = () => {
        router.push(target);
    };

    return (
        <div
            className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 px-4 text-center"
            role="status"
            aria-live="polite"
        >
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-white">{countdown}</span>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-white font-bold text-lg max-w-md mx-auto">{message}</p>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
                    Redirecting to {target === '/schedule' ? 'Schedule' : 'Home'} in {countdown}s...
                </p>
            </div>

            <button
                onClick={handleSkip}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                Redirect Now
            </button>
        </div>
    );
}
