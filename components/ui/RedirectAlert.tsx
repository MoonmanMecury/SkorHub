'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();
    const [count, setCount] = useState(3);
    useEffect(() => {
        const t = setInterval(() => setCount(c => {
            if (c <= 1) { clearInterval(t); router.push(target); }
            return c - 1;
        }), 1000);
        return () => clearInterval(t);
    }, [target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 relative">
                <span className="material-icons text-primary">info</span>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-background-dark">{count}</div>
            </div>
            <h2 className="text-lg font-black uppercase italic tracking-tighter text-white mb-2 max-w-md">{message}</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-8">Redirecting shortly...</p>
            <button onClick={() => router.push(target)} className="flex items-center gap-2 px-6 py-3 bg-[#161618] border border-white/5 hover:border-primary/40 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95">
                Redirect Now <span className="material-icons text-xs">arrow_forward</span>
            </button>
        </div>
    );
}
