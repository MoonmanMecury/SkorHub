
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(target);
        }, 2500);

        return () => clearTimeout(timer);
    }, [target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6" role="alert" aria-live="polite">
            <div className="w-full max-w-md bg-[#161618] border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl animate-ping opacity-20"></div>
                    <span className="material-icons text-primary text-3xl">info</span>
                </div>

                <h3 className="text-white font-black text-xl uppercase italic tracking-tight mb-2">Notice</h3>
                <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex flex-col items-center gap-6 w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    </div>

                    <Link
                        href={target}
                        className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group"
                    >
                        Click here if not redirected
                        <span className="material-icons text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
