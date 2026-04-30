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
        const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
        const timeout = setTimeout(() => router.push(target), 3000);
        return () => { clearInterval(timer); clearTimeout(timeout); };
    }, [target, router, message]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="bg-[#161618] border border-white/5 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons text-primary text-3xl">info</span>
                </div>
                <h3 className="font-black text-lg uppercase italic tracking-tight text-white mb-2">Notice</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">{message}</p>
                <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Redirecting in {seconds}s</p>
                    <Link href={target} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors mt-2">
                        Manual Redirect
                    </Link>
                </div>
            </div>
        </div>
    );
}
