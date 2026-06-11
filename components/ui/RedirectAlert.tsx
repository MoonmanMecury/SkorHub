
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

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, router, target]);

    const handleRedirectNow = () => {
        router.push(target);
    };

    return (
        <div
            className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
            role="alert"
            aria-live="polite"
        >
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-white/5 rounded-full"></div>
                <div
                    className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black text-white">{countdown}</span>
                </div>
            </div>

            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">
                Hang on a second
            </h2>
            <p className="text-slate-400 text-sm max-w-md mb-8">
                {message}
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button
                    onClick={handleRedirectNow}
                    className="px-8 py-4 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
                >
                    Redirect Now
                    <span className="material-icons text-sm">arrow_forward</span>
                </button>

                <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">
                    Redirecting to {target === '/schedule' ? 'Schedule' : 'Home'} in {countdown}s...
                </p>
            </div>
        </div>
    );
}
