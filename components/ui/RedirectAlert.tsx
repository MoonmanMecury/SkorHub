
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
    const [count, setCount] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prev) => {
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

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#161618] border border-white/5 rounded-[2rem] p-8 text-center shadow-2xl space-y-6">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                    <span className="text-2xl font-black text-white italic">{count}</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-white italic">Hold on tight!</h2>
                    <p className="text-slate-400 text-sm font-medium" aria-live="polite">{message}</p>
                </div>
                <div className="flex gap-3 pt-2">
                    <button onClick={() => router.push(target)} className="flex-1 py-3.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-primary/20">Go Now</button>
                    <Link href="/" className="flex-1 py-3.5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center justify-center">Back Home</Link>
                </div>
            </div>
            <p className="mt-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] animate-pulse">
                Auto-redirecting to {target === '/schedule' ? 'Schedule' : 'Home'}
            </p>
        </div>
    );
}
