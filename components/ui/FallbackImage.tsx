
'use client';

import React, { useMemo } from 'react';

interface FallbackImageProps {
    seed: string;
    className?: string;
    text?: string;
}

const GRADIENTS = [
    'from-[#FF0000]/30 via-[#700000]/10 to-black', // Crimson Fire
    'from-[#0066FF]/30 via-[#001133]/10 to-black', // Deep Sea
    'from-[#00FF88]/20 via-[#003311]/10 to-black', // Emerald Vortex
    'from-[#FF8800]/30 via-[#331100]/10 to-black', // Solar Flare
    'from-[#AA00FF]/30 via-[#220033]/10 to-black', // Mystic Purple
    'from-[#00FFFF]/20 via-[#002222]/10 to-black', // Cyber Cyan
    'from-[#FF0088]/30 via-[#330011]/10 to-black', // Neon Rose
    'from-[#FAFF00]/20 via-[#222200]/10 to-black', // Electric Gold
];

export function FallbackImage({ seed, className = "", text = "SkorHub" }: FallbackImageProps) {
    const gradientClass = useMemo(() => {
        // Simple hash function to get a consistent index from the seed string
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % GRADIENTS.length;
        return GRADIENTS[index];
    }, [seed]);

    return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-[#0A0A0B] ${className}`}>
            {/* Animated Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-60`}></div>

            {/* Texture/Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-2xl">
                    <span className="material-icons text-primary text-2xl animate-pulse">play_circle</span>
                </div>
                <span className="text-white/20 font-black text-2xl italic tracking-tighter uppercase select-none">
                    {text}
                </span>
            </div>

            {/* Decorative Edge Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full"></div>
        </div>
    );
}
