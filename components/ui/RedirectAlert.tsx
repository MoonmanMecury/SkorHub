
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        const redirect = setTimeout(() => {
            router.push(target);
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="max-w-md w-full bg-[#161618] border border-white/5 rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="flex justify-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-black text-white">{countdown}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-lg font-black uppercase tracking-tighter text-white">Redirecting</h2>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">
                        {message}
                    </p>
                </div>

                <button
                    onClick={() => router.push(target)}
                    className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
                >
                    Redirect Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="pt-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                        Moving to {target === '/schedule' ? 'Schedule' : 'Home'} in {countdown}s
                    </p>
                </div>
            </div>
        </div>
    );
}
