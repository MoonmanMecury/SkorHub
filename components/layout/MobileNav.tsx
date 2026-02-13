'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import DashboardNavLinks from './DashboardNavLinks';
import HomeNavLinks from './HomeNavLinks';
import AdminNavLinks from '@/components/admin/AdminNavLinks';

export default function MobileNav({ navType = 'dashboard' }: { navType?: 'dashboard' | 'home' | 'admin' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <div className="lg:hidden mr-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    aria-label="Open menu"
                >
                    <span className="material-icons text-2xl">menu</span>
                </button>
            </div>

            {mounted && createPortal(
                <div className="lg:hidden">
                    {/* Overlay */}
                    <div
                        className={`fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <div
                        className={`fixed inset-y-0 left-0 z-[60] w-72 bg-[#0A0A0B] border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    >
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                                    <span className="material-icons text-primary text-3xl">play_circle</span>
                                    <span className="font-bold text-xl tracking-tight text-white italic uppercase">SkorHub</span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 -mr-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    aria-label="Close menu"
                                >
                                    <span className="material-icons">close</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {navType === 'home' ? (
                                    <HomeNavLinks onItemClick={() => setIsOpen(false)} />
                                ) : navType === 'admin' ? (
                                    <AdminNavLinks onItemClick={() => setIsOpen(false)} />
                                ) : (
                                    <DashboardNavLinks onItemClick={() => setIsOpen(false)} />
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/5 mt-auto space-y-4">
                                <Link
                                    href="/"
                                    className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all font-bold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="material-icons text-xl">home</span>
                                    <span>Back to Home</span>
                                </Link>
                                <p className="text-[10px] text-slate-600 text-center uppercase tracking-widest font-bold">
                                    © 2026 Skorhub
                                </p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
