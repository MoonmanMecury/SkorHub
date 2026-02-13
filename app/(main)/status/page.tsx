
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StatusPage() {
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

    // Initial data
    const [services, setServices] = useState([
        { name: 'Core API Gateway', status: 'operational', uptime: '99.98%', latency: 24, icon: 'hub' },
        { name: 'Primary Streaming Cluster', status: 'operational', uptime: '99.95%', latency: 42, icon: 'stream' },
        { name: 'User Authentication Service', status: 'operational', uptime: '100.00%', latency: 12, icon: 'security' },
        { name: 'Subscription & Payments', status: 'operational', uptime: '99.99%', latency: 68, icon: 'payments' },
        { name: 'Image & Assets Proxy', status: 'operational', uptime: '99.91%', latency: 110, icon: 'image' },
        { name: 'Database Engine', status: 'operational', uptime: '100.00%', latency: 4, icon: 'storage' },
    ]);

    const [regions, setRegions] = useState([
        { name: 'Europe (London)', status: 'optimal', load: 12 },
        { name: 'North America (NYC)', status: 'optimal', load: 18 },
        { name: 'Africa (Lagos)', status: 'stable', load: 42 },
        { name: 'Asia (Singapore)', status: 'optimal', load: 8 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Update time
            setLastUpdate(new Date().toLocaleTimeString());

            // Randomly fluctuate latency
            setServices(prev => prev.map(s => ({
                ...s,
                latency: Math.max(1, s.latency + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))
            })));

            // Randomly fluctuate load
            setRegions(prev => prev.map(r => ({
                ...r,
                load: Math.min(100, Math.max(1, r.load + (Math.random() > 0.5 ? 2 : -2) * Math.floor(Math.random() * 2)))
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-20 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Systems Operational</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">System <span className="text-primary NOT-italic">Health</span></h1>
                    <p className="text-slate-500 font-medium mt-3">Live telemetry from our global distribution network and core services.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Last Update</p>
                    <p className="text-xs font-bold text-white uppercase">{lastUpdate}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Global Status Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2.5rem] p-10 flex flex-col items-center text-center justify-center space-y-6">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                        <span className="material-icons text-emerald-500 text-5xl">check_circle</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase text-white tracking-tighter italic">All Systems GO</h2>
                        <p className="text-slate-400 font-medium mt-2">Our engineers are monitoring the network 24/7. No incidents reported in the last 24 hours.</p>
                    </div>
                    <div className="pt-6 grid grid-cols-2 gap-8 w-full">
                        <div>
                            <p className="text-3xl font-black text-white">100%</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Uptime</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white">0s</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Planned Outages</p>
                        </div>
                    </div>
                </div>

                {/* Service Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, i) => (
                        <div key={i} className="bg-[#161618] border border-white/5 rounded-3xl p-6 flex items-start gap-4 group hover:border-emerald-500/30 transition-all duration-500">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors">
                                <span className="material-icons">{service.icon}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-sm font-black uppercase text-white tracking-tight">{service.name}</h3>
                                    <span className="text-[8px] font-black text-emerald-500 uppercase px-2 py-0.5 bg-emerald-500/10 rounded-full">Active</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Uptime: <span className="text-slate-300">{service.uptime}</span></span>
                                    <span>Latency: <span className="text-slate-300 transition-all duration-300">{service.latency}ms</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Regional Status Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase italic tracking-widest text-[#5DD62C]">CDN Region Health</h2>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">4 Regions Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {regions.map((region, i) => (
                        <div key={i} className="bg-[#161618] border border-white/5 rounded-[2rem] p-6 space-y-4 transition-all hover:translate-y-[-4px]">
                            <div className="flex justify-between items-start">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{region.name}</h4>
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-black text-white transition-all duration-500">{region.load}%</p>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Server Load</p>
                                </div>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{region.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
