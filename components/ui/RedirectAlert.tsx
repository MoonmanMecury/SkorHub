
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
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (seconds <= 0) {
            router.push(target);
        }
    }, [seconds, router, target]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-[2rem] border-t-primary animate-spin"></div>
                <span className="material-icons text-primary text-3xl">info</span>
            </div>

            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">Redirecting</h2>
            <p className="text-slate-400 text-sm max-w-sm mb-10 leading-relaxed font-medium">
                {message}
            </p>

            <div className="flex flex-col items-center gap-5 w-full max-w-xs">
                <button
                    onClick={() => router.push(target)}
                    className="w-full py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-primary/20"
                >
                    Redirect Now
                    <span className="material-icons text-sm">arrow_forward</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-slate-800"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        Automatic in <span className="text-primary font-bold">{Math.max(0, seconds)}s</span>
                    </p>
                    <div className="h-[1px] w-8 bg-slate-800"></div>
                </div>
            </div>
        </div>
    );
}
