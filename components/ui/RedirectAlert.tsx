
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
            className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
            role="status"
            aria-live="polite"
        >
            <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                <div
                    className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
                    style={{ animationDuration: '1.5s' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black text-white">{countdown}</span>
                </div>
            </div>

            <div className="max-w-md space-y-4">
                <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white">
                    {message}
                </h2>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
                    Redirecting you in {countdown} seconds...
                </p>

                <button
                    onClick={handleSkip}
                    className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-105 active:scale-95"
                >
                    Skip to {target === '/schedule' ? 'Schedule' : 'Home'}
                </button>
            </div>
        </div>
    );
}
