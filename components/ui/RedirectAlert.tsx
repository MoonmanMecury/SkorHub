'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count <= 0) {
            router.push(target);
            return;
        }
        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
    }, [count, target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                <span className="material-icons text-primary text-4xl animate-bounce">info</span>
                <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white mb-2 max-w-md">
                {message.replace(/ Redirecting to .*$/, '')}
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8">
                Redirecting you in <span className="text-primary font-black">{count}</span> seconds...
            </p>
            <button
                onClick={() => router.push(target)}
                className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95"
            >
                Redirect Now <span className="material-icons text-sm">arrow_forward</span>
            </button>
        </div>
    );
}
