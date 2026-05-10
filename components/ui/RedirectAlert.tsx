'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function RedirectAlert({ message, target }: { message: string; target: string }) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) { router.push(target); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [target, router]);

    const btnClass = "flex-1 text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl transition-all text-center";

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6" role="alert" aria-live="polite">
            <div className="max-w-md w-full bg-[#161618] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center space-y-8 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors duration-500" />
                <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-white/5 rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-2xl font-black text-white italic">{countdown}</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Redirecting...</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">{message}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button onClick={() => router.push(target)} className={`${btnClass} bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20`}>Go Now</button>
                    <Link href="/" className={`${btnClass} bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300`}>Back Home</Link>
                </div>
            </div>
            <p className="mt-8 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] animate-pulse">Auto-redirecting in {countdown}s</p>
        </div>
    );
}
