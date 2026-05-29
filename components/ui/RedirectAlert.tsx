'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(3);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        const redirectTimeout = setTimeout(() => {
            router.push(target);
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [target, router]);

    const targetName = target === '/schedule' ? 'Schedule' :
                      target === '/' ? 'Home' :
                      target.replace('/', '').charAt(0).toUpperCase() + target.slice(2);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/20 shadow-lg shadow-primary/5">
                <span className="material-icons text-primary text-4xl">info</span>
            </div>

            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4 leading-tight">{message}</h2>

            <div className="flex flex-col items-center gap-6 mt-6">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                    Redirecting to {targetName} in {timeLeft}s
                </p>
            </div>
        </div>
    );
}
