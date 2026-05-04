
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
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const redirectTimer = setTimeout(() => {
            router.push(target);
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="bg-[#161618] border border-white/5 rounded-[2rem] p-8 max-w-md w-full shadow-2xl space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-primary font-black text-sm">{countdown}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-white font-black text-xl uppercase italic tracking-tight">Hold on a second</h2>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="pt-2">
                    <Link
                        href={target}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
                    >
                        Go Now
                        <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
                    Redirecting in {countdown}s...
                </p>
            </div>
        </div>
    );
}
