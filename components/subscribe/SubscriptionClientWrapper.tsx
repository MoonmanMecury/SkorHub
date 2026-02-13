
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

declare global {
    interface Window {
        LencoPay: any;
    }
}

export default function SubscriptionClientWrapper() {
    const router = useRouter();
    const { user, mutate, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLencoReady, setIsLencoReady] = useState(false);

    const handleSubscribe = () => {
        if (!user) {
            router.push(`/sign-in?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        if (!isLencoReady && !window.LencoPay) {
            setError("Payment gateway is still loading. Please wait a moment.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const lenco = window.LencoPay;
            lenco.getPaid({
                key: process.env.NEXT_PUBLIC_LENCO_PUBLIC_KEY || 'pub-92bda42a771fc2ab31edeb8cdb02fd80febe646db7135d94',
                reference: '9S-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                email: user.email,
                amount: 5, // K28.00
                currency: "ZMW",
                channels: ["card", "mobile-money"],
                customer: {
                    firstName: user.email.split('@')[0],
                    lastName: "Subscriber",
                },
                onSuccess: async function (lencoResponse: any) {
                    console.log("Payment Success:", lencoResponse);
                    setLoading(true);

                    try {
                        const res = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ reference: lencoResponse.reference })
                        });

                        const data = await res.json();

                        if (res.ok && data.success) {
                            await mutate(); // Refresh user state
                            router.push('/account?status=activated');
                        } else {
                            throw new Error(data.message || 'Verification failed');
                        }
                    } catch (err: any) {
                        console.error(err);
                        setError("Payment succeeded but verification failed. Please contact support.");
                        setLoading(false);
                    }
                },
                onClose: function () {
                    setLoading(false);
                }
            });
        } catch (err: any) {
            console.error("Lenco Initialization Error:", err);
            setError("Failed to start payment. Please refresh and try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <Script
                src="https://pay.lenco.co/js/v1/inline.js"
                strategy="afterInteractive"
                onLoad={() => setIsLencoReady(true)}
            />

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
                        Experience <span className="text-primary italic">Pro</span> Streaming
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        Join thousands of fans enjoying crystal clear 4K streams with ZERO ads and priority server access.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Free Plan */}
                    <div className="bg-[#161618] border border-white/5 p-8 rounded-[2.5rem] opacity-60">
                        <h3 className="text-xl font-bold text-white mb-2">Free Basic</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-white">K0</span>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <span className="material-icons text-slate-600 text-lg">check_circle</span>
                                SD Quality Streams
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <span className="material-icons text-slate-600 text-lg">check_circle</span>
                                Standard Ad Support
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <span className="material-icons text-slate-600 text-lg">check_circle</span>
                                Basic Community Support
                            </li>
                        </ul>
                        <button disabled className="w-full py-4 bg-white/5 text-slate-500 font-bold uppercase rounded-2xl border border-white/5 cursor-not-allowed">
                            Current Plan
                        </button>
                    </div>

                    {/* Pro Plan (Featured) */}
                    <div className="relative group lg:scale-110">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-orange-500 to-rose-600 rounded-[3rem] blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-[#0A0A0B] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                            <div className="absolute top-0 right-0 bg-primary text-white px-6 py-2 rounded-bl-[1.5rem] rounded-tr-[2.5rem] font-black text-[10px] uppercase tracking-widest">
                                Recommended
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Premium Pro</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-6xl font-black text-white italic">K28</span>
                                <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">/ month</span>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold flex items-center gap-3">
                                    <span className="material-icons text-sm">error</span>
                                    {error}
                                </div>
                            )}

                            <ul className="space-y-5 mb-10">
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="material-icons text-primary text-[14px]">check</span>
                                    </div>
                                    <span className="font-bold">Ultra HD & 4K Streams</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="material-icons text-primary text-[14px]">check</span>
                                    </div>
                                    <span className="font-bold text-emerald-400">Zero Commercial Ads</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="material-icons text-primary text-[14px]">check</span>
                                    </div>
                                    <span className="font-bold text-orange-400">Priority Server Access</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="material-icons text-primary text-[14px]">check</span>
                                    </div>
                                    <span className="font-bold">Multi-screen Support</span>
                                </li>
                            </ul>

                            <button
                                onClick={handleSubscribe}
                                disabled={loading || authLoading}
                                className="w-full py-5 bg-primary hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all shadow-xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span className="material-symbols-outlined font-black">rocket_launch</span>
                                )}
                                {loading ? 'Processing...' : (user ? 'Upgrade to Pro' : 'Login to Upgrade')}
                            </button>

                            <p className="mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center">
                                Instant Activation • Secure via Lenco Pay
                            </p>
                        </div>
                    </div>

                    {/* Annual Plan */}
                    <div className="bg-[#161618] border border-white/5 p-8 rounded-[2.5rem]">
                        <h3 className="text-xl font-bold text-white mb-2">Annual Elite</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-white">K280</span>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ year</span>
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-6">
                            Save 20% Yearly
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <span className="material-icons text-primary/40 text-lg">check_circle</span>
                                All Pro Features
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <span className="material-icons text-primary/40 text-lg">check_circle</span>
                                Exclusive Beta Access
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <span className="material-icons text-primary/40 text-lg">check_circle</span>
                                VIP Account Management
                            </li>
                        </ul>
                        <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase rounded-2xl border border-white/10 transition-all">
                            Coming Soon
                        </button>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-12 grayscale opacity-50">
                    <img src="https://pay.lenco.co/img/lenco-logo.png" alt="Lenco" className="h-6" />
                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        <span className="material-icons text-sm">lock</span>
                        SSL Encrypted
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        <span className="material-icons text-sm">verified_user</span>
                        PCI DSS Compliant
                    </div>
                </div>
            </div>
        </>
    );
}

