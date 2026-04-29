
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
        const timer = setInterval(() => {
            setSeconds((prev) => Math.max(0, prev - 1));
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
        <div
            className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
            role="alert"
            aria-live="polite"
        >
            <div className="bg-[#161618] border border-white/5 rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons text-primary text-3xl">info</span>
                </div>

                <h2 className="text-lg font-black uppercase italic tracking-tight text-white mb-3">
                    Notice
                </h2>

                <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Redirecting in {seconds} seconds...
                    </p>

                    <Link
                        href={target}
                        className="inline-block text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    >
                        Click here if not redirected
                    </Link>
                </div>
            </div>
        </div>
    );
}
