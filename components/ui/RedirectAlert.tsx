'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function RedirectAlert({ message, target }: { message: string; target: string }) {
    const router = useRouter();
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        if (seconds <= 0) {
            router.push(target);
            return;
        }
        const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
        return () => clearInterval(timer);
    }, [seconds, target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="relative mb-8 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full absolute" />
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="absolute text-lg font-black text-primary">{seconds}</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Wait a moment</h2>
            <p className="text-slate-400 text-sm max-w-md mb-8">{message}</p>
            <div className="flex flex-col items-center gap-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">
                    Redirecting to {target.includes('schedule') ? 'Schedule' : 'Home'}
                </p>
                <button
                    onClick={() => router.push(target)}
                    className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                    <span>Redirect Now</span>
                    <span className="material-icons text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
