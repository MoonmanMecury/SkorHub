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
        if (countdown <= 0) {
            router.push(target);
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, router, target]);

    const handleRedirect = () => {
        router.push(target);
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                <div
                    className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
                    style={{ animationDuration: '1.5s' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{countdown}</span>
                </div>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-4 max-w-md">
                {message}
            </h2>

            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">
                Redirecting you to {target === '/schedule' ? 'Schedule' : 'Home'} in {countdown}s...
            </p>

            <button
                onClick={handleRedirect}
                className="group flex items-center gap-2 px-6 py-3 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B] outline-none"
            >
                Redirect Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
