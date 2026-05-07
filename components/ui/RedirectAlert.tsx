'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6" role="alert" aria-live="polite">
            <div className="max-w-md w-full bg-[#161618] border border-white/5 rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="relative">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 mb-6">
                        <span className="text-xl font-black text-primary">{countdown}</span>
                    </div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-white leading-tight">{message}</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] mt-4">Redirecting in {countdown}s...</p>
                </div>
                <div className="pt-2 flex flex-col gap-3">
                    <button onClick={() => router.push(target)} className="w-full py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer">Go Now</button>
                    <Link href="/" className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
