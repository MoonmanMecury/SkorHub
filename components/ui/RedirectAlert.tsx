
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
        if (seconds <= 0) {
            router.push(target);
            return;
        }

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds, target, router]);

    const targetName = target === '/schedule' ? 'Schedule' : 'Home';

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="bg-[#161618] border border-white/5 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden max-w-md w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

                <div className="relative z-10 space-y-6">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                        <div
                            className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                            style={{ animationDuration: '2s' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-black text-white italic" aria-hidden="true">{seconds}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Hold on a moment</h3>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed">{message}</p>
                    </div>

                    <div className="pt-4">
                        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                            Redirecting in {seconds} seconds to <span className="text-primary italic">{targetName}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
