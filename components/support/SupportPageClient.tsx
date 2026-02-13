'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

declare global {
    interface Window {
        LencoPay: any;
    }
}

interface SupporterStats {
    totalSupporters: number;
    supporterCount: number;
    vipCount: number;
    totalRaised: number;
    monthlyRevenue: number;
    monthlyGoal: number;
    progressPercent: number;
}

interface SupportPageClientProps {
    initialStats: SupporterStats;
}

export default function SupportPageClient({ initialStats }: SupportPageClientProps) {
    const router = useRouter();
    const { user, mutate } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLencoReady, setIsLencoReady] = useState(false);
    const [selectedTier, setSelectedTier] = useState<'supporter' | 'vip' | null>(null);
    const [oneTimeAmount, setOneTimeAmount] = useState(20);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successDetails, setSuccessDetails] = useState<{ tier: string; amount: number } | null>(null);

    const handleDonate = async (tier: 'supporter' | 'vip' | 'one-time', amount?: number) => {
        if (!user) {
            router.push(`/sign-in?returnUrl=${encodeURIComponent('/support')}`);
            return;
        }

        if (!isLencoReady && !window.LencoPay) {
            setError('Payment gateway is still loading. Please wait a moment.');
            return;
        }

        setLoading(true);
        setError('');
        setSelectedTier(tier === 'one-time' ? null : tier);

        try {
            // Initialize donation
            const initResponse = await fetch('/api/support/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier,
                    amount: tier === 'one-time' ? amount : undefined,
                    isRecurring: tier !== 'one-time',
                }),
            });

            const initData = await initResponse.json();

            if (!initResponse.ok) {
                throw new Error(initData.error || 'Failed to initialize donation');
            }

            // Launch Lenco payment
            const lenco = window.LencoPay;
            lenco.getPaid({
                key: process.env.NEXT_PUBLIC_LENCO_PUBLIC_KEY || 'pub-92bda42a771fc2ab31edeb8cdb02fd80febe646db7135d94',
                reference: initData.reference,
                email: user.email,
                amount: initData.amount,
                currency: 'ZMW',
                channels: ['card', 'mobile-money'],
                customer: {
                    firstName: user.email.split('@')[0],
                    lastName: 'Supporter',
                },
                onSuccess: async function (lencoResponse: any) {
                    console.log('Donation Success:', lencoResponse);
                    setLoading(true);

                    try {
                        const verifyResponse = await fetch('/api/support/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ reference: lencoResponse.reference }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyResponse.ok && verifyData.success) {
                            await mutate(); // Refresh user state
                            setSuccessDetails({ tier, amount: initData.amount });
                            setShowSuccessModal(true);
                            setLoading(false);
                        } else {
                            throw new Error(verifyData.error || 'Verification failed');
                        }
                    } catch (err: any) {
                        console.error(err);
                        setError('Donation succeeded but verification failed. Please contact support.');
                        setLoading(false);
                    }
                },
                onClose: function () {
                    setLoading(false);
                    setSelectedTier(null);
                },
            });
        } catch (err: any) {
            console.error('Donation Error:', err);
            setError(err.message || 'Failed to start donation. Please try again.');
            setLoading(false);
            setSelectedTier(null);
        }
    };

    return (
        <>
            <Script
                src="https://pay.lenco.co/js/v1/inline.js"
                strategy="afterInteractive"
                onLoad={() => setIsLencoReady(true)}
            />

            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                        Support <span className="text-primary italic">SkorHub</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        We're building this together. No corporate backing, no investors — just sports fans like you helping create the best streaming directory for Zambia.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/5 mb-16">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black uppercase text-white">Monthly Goal: Break Even</h3>
                        <span className="text-2xl font-black text-primary">
                            {Math.round(initialStats.progressPercent)}% reached
                        </span>
                    </div>
                    <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-orange-500 transition-all duration-1000"
                            style={{ width: `${Math.min(100, initialStats.progressPercent)}%` }}
                        />
                    </div>
                    <p className="text-sm text-slate-500 mt-3 font-medium">
                        {initialStats.totalSupporters} supporters helping us reach our goal
                    </p>
                </div>

                {/* Why We Need Support */}
                <div className="mb-16">
                    <h2 className="text-3xl font-black uppercase text-white mb-6">Where Your Support Goes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-icons text-primary text-2xl">dns</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">Server Hosting</h3>
                            <p className="text-sm text-slate-400">K500/month to keep the site running fast and reliable</p>
                        </div>
                        <div className="glass p-6 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-icons text-orange-500 text-2xl">security</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">Domain & SSL</h3>
                            <p className="text-sm text-slate-400">K50/month for domain and security certificates</p>
                        </div>
                        <div className="glass p-6 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-icons text-emerald-500 text-2xl">rocket_launch</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">Future Features</h3>
                            <p className="text-sm text-slate-400">Saving toward licensed streams and mobile app</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-3">
                        <span className="material-icons">error</span>
                        {error}
                    </div>
                )}

                {/* Supporter Tiers */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-center">
                    {/* VIP Tier */}
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-orange-500/20 transition-all">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⭐</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase text-white mb-2">VIP Supporter</h3>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-5xl font-black text-white italic">K30</span>
                                <span className="text-slate-500 text-sm font-bold uppercase">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="material-icons text-orange-500 text-lg mt-0.5">check_circle</span>
                                <span className="font-bold">HD stream priority</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="material-icons text-orange-500 text-lg mt-0.5">check_circle</span>
                                <span className="font-bold">Favorite teams feature</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="material-icons text-orange-500 text-lg mt-0.5">check_circle</span>
                                <span className="font-bold">VIP WhatsApp group access</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-400">
                                <span className="material-icons text-slate-600 text-lg mt-0.5">schedule</span>
                                <span className="font-medium italic">Watch history (coming soon)</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleDonate('vip')}
                            disabled={loading}
                            className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase rounded-2xl transition-all disabled:opacity-50 active:scale-95"
                        >
                            {loading && selectedTier === 'vip' ? 'Processing...' : 'Become VIP'}
                        </button>
                    </div>

                    {/* Supporter Tier (Most Popular/Center) */}
                    <div className="relative lg:scale-105">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-orange-500 to-rose-600 rounded-[3rem] blur opacity-25"></div>
                        <div className="relative glass p-8 rounded-[2.5rem] border border-white/10">
                            <div className="absolute top-0 right-1/2 translate-x-1/2 -top-4 bg-primary text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                                Most Popular
                            </div>

                            <div className="text-center mb-6 mt-4">
                                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🌟</span>
                                </div>
                                <h3 className="text-2xl font-black uppercase text-white mb-2">Supporter</h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-5xl font-black text-white italic">K15</span>
                                    <span className="text-slate-500 text-sm font-bold uppercase">/month</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <span className="material-icons text-primary text-lg mt-0.5">check_circle</span>
                                    <span className="font-medium">Remove website ads</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <span className="material-icons text-primary text-lg mt-0.5">check_circle</span>
                                    <span className="font-medium">Supporter badge on profile</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <span className="material-icons text-primary text-lg mt-0.5">check_circle</span>
                                    <span className="font-medium">Thank you on supporters page</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <span className="material-icons text-primary text-lg mt-0.5">check_circle</span>
                                    <span className="font-medium">Priority email support</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleDonate('supporter')}
                                disabled={loading}
                                className="w-full py-4 bg-primary hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all shadow-xl shadow-primary/40 disabled:opacity-50 active:scale-95"
                            >
                                {loading && selectedTier === 'supporter' ? 'Processing...' : 'Become a Supporter'}
                            </button>
                        </div>
                    </div>

                    {/* One-Time Donation */}
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">☕</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase text-white mb-2">One-Time</h3>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-5xl font-black text-white italic">K{oneTimeAmount}</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                step="5"
                                value={oneTimeAmount}
                                onChange={(e) => setOneTimeAmount(parseInt(e.target.value))}
                                className="w-full mt-4"
                            />
                            <p className="text-xs text-slate-500 mt-2 font-medium">K5 - K100</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="material-icons text-emerald-500 text-lg mt-0.5">check_circle</span>
                                <span className="font-medium">Thank you email</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="material-icons text-emerald-500 text-lg mt-0.5">check_circle</span>
                                <span className="font-medium">Name on supporters page</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="material-icons text-emerald-500 text-lg mt-0.5">check_circle</span>
                                <span className="font-bold text-emerald-400">7-day Supporter perks trial</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleDonate('one-time', oneTimeAmount)}
                            disabled={loading}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase rounded-2xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 active:scale-95"
                        >
                            {loading && selectedTier === null ? 'Processing...' : 'Donate Once'}
                        </button>
                    </div>
                </div>

                {/* Honesty Section */}
                <div className="glass p-10 rounded-[2.5rem] border border-orange-500/20 mb-16">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="material-icons text-orange-500 text-2xl">warning</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase text-white mb-4">What We CAN'T Do (Yet)</h2>
                            <p className="text-slate-400 font-medium mb-4">We're being honest with you:</p>
                        </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <span className="material-icons text-red-500 text-lg mt-0.5">close</span>
                            <span className="font-medium">We can't remove ads from the stream players (they're embedded iframes)</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <span className="material-icons text-red-500 text-lg mt-0.5">close</span>
                            <span className="font-medium">We don't have a mobile app yet</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <span className="material-icons text-red-500 text-lg mt-0.5">close</span>
                            <span className="font-medium">We don't own the content (we aggregate streams)</span>
                        </li>
                    </ul>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                        <p className="text-emerald-400 font-bold text-sm">
                            <span className="text-white font-black">BUT</span> we're transparent about our roadmap.
                            When we hit <span className="text-white font-black">K30,000/month</span> in support,
                            we'll license official streams and THEN we can offer true ad-free viewing!
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <p className="text-slate-500 text-sm font-medium mb-4">
                        Want to see who else is supporting? <Link href="/supporters" className="text-primary hover:underline font-bold">View our supporters</Link>
                    </p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        Secure processing via Lenco • Instant activation • Cancel anytime
                    </p>
                </div>
            </div>

            {/* Success Popup */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => router.push('/account')} />
                    <div className="relative bg-[#1A1A1D] border border-emerald-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 z-10 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-4 border-[#0A0A0B]">
                                <span className="text-5xl">🎉</span>
                            </div>
                        </div>

                        <div className="pt-8 space-y-2">
                            <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">Thank You!</h2>
                            <p className="text-slate-400 font-medium">Your donation was successful.</p>
                        </div>

                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
                            <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">You contributed</p>
                            <p className="text-4xl font-black text-emerald-500 italic">K{successDetails?.amount}</p>
                            {successDetails?.tier !== 'one-time' && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">New Status</p>
                                    <p className="text-lg font-bold text-white capitalize">{successDetails?.tier} Supporter</p>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-slate-400">
                            Your support helps us keep SkorHub alive for everyone.
                        </p>

                        <button
                            onClick={() => router.push('/account')}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
