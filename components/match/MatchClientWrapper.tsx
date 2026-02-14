'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
    ssr: false,
    loading: () => (
        <div className="aspect-video bg-[#161618] rounded-2xl animate-pulse border border-white/5 flex items-center justify-center">
            <span className="material-icons text-slate-700 text-6xl">play_circle</span>
        </div>
    )
});
import { getStreamsAction } from '@/app/actions/matches';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { FallbackImage } from '../ui/FallbackImage';
import { useFavorites } from '@/hooks/use-favorites';
import { AdPlaceholder } from '../ui/AdPlaceholder';

// Types
import { Match, Stream } from '@/types';

interface MatchClientWrapperProps {
    initialMatch: any; // Using any for now to avoid strict type mismatch during dev if types aren't 100% aligned
    matchId: string;
}

export default function MatchClientWrapper({ initialMatch, matchId }: MatchClientWrapperProps) {
    const { user } = useAuth();
    const { isFavorited, toggleFavorite } = useFavorites();
    const [match, setMatch] = useState<any>(initialMatch);
    const [streams, setStreams] = useState<any[]>([]);
    const [activeStream, setActiveStream] = useState<any>(null);
    const [streamQuality, setStreamQuality] = useState('auto');
    const [loading, setLoading] = useState(true);
    const [streamError, setStreamError] = useState<string | null>(null);
    const [activeSource, setActiveSource] = useState<any>(null);
    const [serverHealth, setServerHealth] = useState<Record<string, string>>({});
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);

    const [showServerSelect, setShowServerSelect] = useState(false);

    // Fetch streams for a source
    const handleServerChange = useCallback(async (source: any) => {
        setLoading(true);
        setStreamError(null);
        setActiveSource(source);
        setStreams([]);
        setActiveStream(null);

        try {
            const data = await getStreamsAction(source.source, source.id);
            if (!data || data.length === 0) throw new Error("No streams available");
            setStreams(data);

            let selected = data[0];
            if (streamQuality === 'hd') selected = data.find((s: any) => s.hd) || data[0];
            else if (streamQuality === 'sd') selected = data.find((s: any) => !s.hd) || data[0];

            setActiveStream(selected);
            setServerHealth(prev => ({ ...prev, [source.source]: 'healthy' }));
        } catch (err: any) {
            setStreamError(err.message || "Failed to load stream");
            setServerHealth(prev => ({ ...prev, [source.source]: 'failed' }));
        } finally {
            setLoading(false);
        }
    }, [streamQuality]);

    // Auto-select first source on load
    useEffect(() => {
        if (match?.sources?.length > 0 && !activeSource && !loading) {
            handleServerChange(match.sources[0]);
        }
    }, [match, activeSource, loading, handleServerChange]);

    // Load initial preferences
    useEffect(() => {
        const savedQuality = localStorage.getItem('9streams_quality');
        if (savedQuality) setStreamQuality(savedQuality);
    }, []);

    // Save quality
    useEffect(() => {
        localStorage.setItem('9streams_quality', streamQuality);
    }, [streamQuality]);

    const handleQualityChange = (quality: string) => {
        setStreamQuality(quality);
        if (!streams.length) return;

        let target = activeStream;
        if (quality === 'hd') target = streams.find(s => s.hd) || streams[0];
        else if (quality === 'sd') target = streams.find(s => !s.hd) || streams[0];
        else target = streams.find(s => s.hd) || streams[0];

        if (target && target.embedUrl !== activeStream?.embedUrl) {
            setActiveStream(target);
        }
    };

    const isFav = isFavorited(matchId);

    const copyShareLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShareSuccess(true);
            setTimeout(() => setShareSuccess(false), 2000);
            setShowShareMenu(false);
        } catch (e) {
            console.error('Failed to copy', e);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT: Player & Controls */}
            <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <span className="material-icons text-slate-400 text-sm">arrow_back</span>
                        </Link>
                        <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            Live Broadcast
                        </span>
                    </div>
                </div>

                <VideoPlayer
                    streamUrl={activeStream?.embedUrl || null}
                    streamQuality={streamQuality}
                    onQualityChange={handleQualityChange}
                    matchTitle={match?.title}
                    isPremium={user?.premium}
                    posterUrl={match?.poster}
                />

                {/* Unified Server Controls */}
                <div className="space-y-6 bg-[#161618]/30 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div>
                            <h3 className="text-[11px] font-black uppercase text-white tracking-widest">Network Gateways</h3>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Select your preferred signal source</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Nodes Operational</span>
                        </div>
                    </div>

                    {/* Providers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {match?.sources?.map((src: any, i: number) => {
                            const isActive = activeSource?.source === src.source;
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleServerChange(src)}
                                    className={`p-3 rounded-xl border transition-all text-center relative overflow-hidden ${isActive
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <p className="text-[10px] font-black uppercase tracking-tighter truncate">Gateway {src.source}</p>
                                    <p className={`text-[8px] font-bold uppercase opacity-60 mt-0.5 ${isActive ? 'text-white' : ''}`}>{src.language || 'GBL'}</p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Channels for active provider */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Signal Channels</span>
                            <div className="flex-1 h-[1px] bg-white/5"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {loading ? (
                                <div className="col-span-2 py-8 flex flex-col items-center justify-center gap-3 text-slate-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                                    <div className="w-6 h-6 border-2 border-primary border-t-white rounded-full animate-spin"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Acquiring Stream...</span>
                                </div>
                            ) : streamError ? (
                                <div className="col-span-2 py-8 text-center bg-red-500/5 rounded-xl border border-red-500/10">
                                    <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">Gateway Error: {streamError}</p>
                                </div>
                            ) : streams.length > 0 ? (
                                streams.map((stream: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveStream(stream)}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${activeStream?.embedUrl === stream.embedUrl
                                            ? 'bg-primary/10 border-primary/50 text-white'
                                            : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${activeStream?.embedUrl === stream.embedUrl ? 'bg-primary animate-pulse' : 'bg-slate-700'}`}></div>
                                                <p className="text-[11px] font-black uppercase tracking-tight">Channel {stream.streamNo}</p>
                                            </div>
                                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase border ${stream.hd
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-slate-500/10 text-slate-400 border-white/5'
                                                }`}>
                                                {stream.hd ? 'HD' : 'SD'}
                                            </span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 py-8 text-center text-slate-600 italic text-[10px]">
                                    Select a gateway node to view channels
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area Ad Slot */}
                <AdPlaceholder id="match-content-ad" className="mt-8" />
            </div>

            {/* RIGHT: Match Information */}
            <div className="lg:col-span-1 space-y-4">
                <div className="glass p-5 rounded-2xl border border-white/5 bg-[#161618]/80 shadow-2xl flex flex-col gap-6">
                    <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">Event Profile</span>
                        <h1 className="text-xl font-black uppercase text-white tracking-widest leading-none">
                            {match?.teams?.home?.name}
                        </h1>
                        <span className="text-primary font-black italic text-xs">VS</span>
                        <h1 className="text-xl font-black uppercase text-white tracking-widest leading-none">
                            {match?.teams?.away?.name}
                        </h1>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Category</span>
                            <span className="text-[9px] font-black text-primary uppercase">{match?.sportCategory}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Kickoff</span>
                            <span className="text-[9px] font-black text-white uppercase">{new Date(match?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
                        <button
                            onClick={() => toggleFavorite(matchId)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all border ${isFav
                                ? 'bg-primary border-primary text-white shadow-lg'
                                : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-sm mb-1 ${isFav ? 'fill-current' : ''}`}>star</span>
                            <span className="text-[8px] font-black uppercase tracking-widest">Save</span>
                        </button>
                        <div className="relative group/share">
                            <button
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="w-full h-full flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-transparent text-slate-500 hover:bg-white/10 transition-all"
                            >
                                <span className="material-icons text-sm mb-1">share</span>
                                <span className="text-[8px] font-black uppercase tracking-widest">Share</span>
                            </button>
                            {showShareMenu && (
                                <div className="absolute bottom-full right-0 mb-2 bg-[#1A1A1A] border border-white/10 rounded-xl p-2 w-full shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                                    <button onClick={copyShareLink} className="w-full py-2 rounded-lg hover:bg-white/5 text-[8px] font-black uppercase tracking-widest text-slate-300">
                                        {shareSuccess ? 'Copied!' : 'Copy Link'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="w-full py-4 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-white/10 transition-all mt-2">
                        Troubleshooting Mode
                    </button>
                </div>

                <div className="glass p-5 rounded-2xl border border-white/5 bg-[#161618]/50 overflow-hidden">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-4">Ad Sponsor</span>
                    <AdPlaceholder id="match-sidebar-ad" type="sidebar" />
                </div>
            </div>
        </div>
    );
}
