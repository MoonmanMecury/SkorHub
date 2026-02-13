
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Next.js Global Error:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full glass p-10 rounded-[3rem] border border-red-500/10 text-center relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 blur-[100px] -z-10 group-hover:bg-red-500/20 transition-all duration-700"></div>

                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                    <span className="material-icons text-red-500 text-4xl">report_problem</span>
                </div>

                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-4">Connection <span className="text-primary NOT-italic">Interrupted</span></h1>
                <p className="text-slate-500 font-medium mb-10">We've encountered a glitch in the broadcast signal. Our engineers are already on it.</p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => reset()}
                        className="w-full py-4 bg-primary text-white font-black uppercase rounded-2xl text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Re-Connect Signal
                    </button>
                    <Link
                        href="/"
                        className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 font-black uppercase rounded-2xl text-[10px] tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                        Back to Safe Zone
                    </Link>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Error Digest: {error.digest || 'SIG-INTERNAL-9ST'}</p>
                </div>
            </div>
        </div>
    );
}
