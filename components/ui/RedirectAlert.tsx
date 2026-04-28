
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
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(target);
        }, 3000);

        const interval = setInterval(() => {
            setSeconds((s) => Math.max(0, s - 1));
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [target, router, message]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6" role="alert" aria-live="polite">
            <div className="max-w-md w-full bg-[#161618] border border-white/5 rounded-[2.5rem] p-10 text-center space-y-8 shadow-2xl relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                        <span className="material-icons text-4xl text-primary">info</span>
                    </div>

                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-white mb-4">
                        Just a moment
                    </h2>

                    <p className="text-slate-400 font-medium leading-relaxed mb-8">
                        {message}
                    </p>

                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-3">
                            {/* Loading Indicator */}
                            <div className="flex gap-1.5 mb-1">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Redirecting in {seconds}s...
                            </p>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <Link
                                href={target}
                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
                            >
                                Click here to go now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
