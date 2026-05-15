
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

    const progress = 251.2 - (251.2 * (3 - count)) / 3;

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" aria-live="polite">
            <div className="max-w-md w-full bg-[#161618] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                        <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="201.1" strokeDashoffset={201.1 - (201.1 * (3 - count)) / 3} className="text-primary transition-all duration-1000 ease-linear" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-black text-white italic">{count}</span></div>
                </div>
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Wait a second...</h2>
                <p className="text-slate-400 text-xs font-medium mb-6">{message}</p>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => router.push(target)} className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20">Go Now</button>
                    <button onClick={() => router.push('/')} className="px-6 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">Home</button>
                </div>
                <p className="mt-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Redirecting to {target === '/schedule' ? 'Schedule' : 'Home'}</p>
            </div>
        </div>
    );
}
