'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function RedirectAlert({ message, target }: { message: string; target: string }) {
    const router = useRouter();
    const [count, setCount] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((p) => {
                if (p <= 1) { clearInterval(timer); router.push(target); return 0; }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="max-w-md w-full bg-[#161618] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-white italic">{count}</div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Redirecting</h2>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">{message}</p>
                </div>
                <div className="pt-2 flex flex-col items-center gap-4">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Redirect in {count}s</p>
                    <Link href={target} className="px-8 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all shadow-lg">Go Now</Link>
                </div>
            </div>
        </div>
    );
}
