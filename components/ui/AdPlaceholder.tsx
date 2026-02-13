
'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

interface AdPlaceholderProps {
    id: string;
    className?: string;
    type?: 'banner' | 'sidebar' | 'native';
}

export function AdPlaceholder({ id, className = "", type = "banner" }: AdPlaceholderProps) {
    const { user, loading } = useAuth();

    // Hide ads for premium users OR supporters (any tier)
    if (!loading && (user?.premium || user?.supporter_tier)) {
        return null;
    }

    if (type === 'sidebar') {
        return (
            <div id={id} className={`bg-[#161618] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 ${className}`}>
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <span className="material-icons text-slate-600">branding_watermark</span>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Sponsored</p>
                    <p className="text-xs font-bold text-slate-400">Support SkorHub to remove website ads.</p>
                </div>
                <Link href="/support" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    Become a Supporter
                </Link>
            </div>
        );
    }

    return (
        <div id={id} className={`relative overflow-hidden bg-[#161618] border border-white/5 rounded-3xl p-8 group transition-all hover:border-primary/20 ${className}`}>
            <div className="absolute top-0 right-0 p-3 opacity-20">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Ad Space</span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                        <span className="material-icons text-primary text-3xl">rocket_launch</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Support SkorHub</h3>
                        <p className="text-slate-400 text-sm font-medium">Help us grow and get ad-free browsing starting at K15/month.</p>
                    </div>
                </div>

                <Link href="/support" className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl">
                    Support Now
                </Link>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-[60px] rounded-full group-hover:bg-primary/10 transition-colors"></div>
        </div>
    );
}
