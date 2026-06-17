
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

    const handleRedirectNow = () => {
        router.push(target);
    };

    const targetLabel = target === '/schedule' ? 'Schedule' : 'Home';

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-white/5 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-primary italic">{countdown}</span>
                </div>
                <div
                    className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                    style={{ animationDuration: '1.5s' }}
                ></div>
            </div>

            <div className="max-w-md space-y-6">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tight">{message}</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    Redirecting you to the <span className="text-white">{targetLabel}</span> in {countdown} seconds...
                </p>

                <button
                    onClick={handleRedirectNow}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
                >
                    Redirect Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
