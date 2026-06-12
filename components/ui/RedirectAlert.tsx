'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps { message: string; target: string; }

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

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-primary">{countdown}</span>
                </div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>

            <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-2 italic">Notice</h2>
            <p className="text-slate-400 text-sm font-medium max-w-md mb-8 leading-relaxed">{message}</p>

            <button
                onClick={() => router.push(target)}
                className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:border-primary transition-all duration-300"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Redirect Now</span>
                <span className="material-icons text-sm text-primary group-hover:text-white transition-colors">arrow_forward</span>
            </button>

            <p className="mt-8 text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-[1px] bg-slate-800"></span>
                Destination: {target === '/schedule' ? 'Full Schedule' : 'Home'}
                <span className="w-4 h-[1px] bg-slate-800"></span>
            </p>
        </div>
    );
}
