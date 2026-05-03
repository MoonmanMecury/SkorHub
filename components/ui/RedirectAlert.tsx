
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
        }, 3000);

        return () => clearTimeout(timer);
    }, [target, router]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="max-w-md w-full bg-[#161618] border border-white/5 rounded-[2rem] p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                    <span className="material-icons text-primary text-4xl">info</span>
                </div>

                <div className="space-y-3">
                    <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">Notice</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="pt-2 flex flex-col items-center gap-6">
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
                            Automatic redirection...
                        </p>

                        <Link
                            href={target}
                            className="inline-block px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                            Go Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
