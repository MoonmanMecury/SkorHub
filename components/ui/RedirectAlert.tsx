'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export function RedirectAlert({ message, target }: { message: string, target: string }) {
    const router = useRouter();
    const [count, setCount] = useState(3);
    useEffect(() => {
        const t = setInterval(() => setCount(p => p > 0 ? p - 1 : 0), 1000);
        return () => clearInterval(t);
    }, []);
    useEffect(() => { if (count === 0) router.push(target); }, [count, target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" role="alert" aria-live="polite">
            <div className="w-16 h-16 relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xl font-black text-white italic">{count}</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-3">Wait a moment</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-sm mb-8 leading-relaxed">{message}</p>
            <button onClick={() => router.push(target)} className="group flex items-center gap-2 px-8 py-3.5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                Redirect Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
