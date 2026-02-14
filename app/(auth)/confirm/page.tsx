
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/sign-in');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0B]">
            <div className="w-full max-w-md space-y-8 glass p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 p-4 -rotate-12 opacity-5">
                    <span className="material-icons text-9xl">verified_user</span>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center space-x-2 mb-8">
                        <span className="material-icons text-primary text-4xl">play_circle</span>
                        <span className="font-black text-2xl tracking-tighter text-white italic uppercase">SkorHub</span>
                    </div>

                    <div className="mb-6">
                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-icons text-emerald-500 text-4xl animate-bounce">check_circle</span>
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Account Verified</h2>
                        <p className="text-slate-500 font-medium mt-4">
                            Your email has been successfully confirmed. You can now access all premium features.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/sign-in"
                            className="w-full py-5 bg-primary hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all shadow-lg shadow-primary/20 block active:scale-95"
                        >
                            Sign In Now
                        </Link>

                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                            Redirecting you in <span className="text-white">{countdown}</span> seconds...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
